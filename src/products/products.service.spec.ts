import { Test, TestingModule } from '@nestjs/testing';
import { ProdutosService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { NotFoundException } from '@nestjs/common';

describe('ProdutosService', () => {
  let service: ProdutosService;

  const mockProdutoRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    preload: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutosService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProdutoRepository,
        },
      ],
    }).compile();

    service = module.get<ProdutosService>(ProdutosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const createDto = {
        user_id: 1,
        name: 'Produto Teste',
        price: 99.99,
        quantity: 10,
      };
      const expectedProduct = { id: 1, ...createDto };

      mockProdutoRepository.create.mockReturnValue(expectedProduct);
      mockProdutoRepository.save.mockResolvedValue(expectedProduct);

      const result = await service.create(createDto);

      expect(mockProdutoRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockProdutoRepository.save).toHaveBeenCalledWith(expectedProduct);
      expect(result).toEqual(expectedProduct);
    });
  });

  describe('findAll', () => {
    it('should return only products belonging to the user', async () => {
      const userId = 1;
      const products = [
        { id: 1, user_id: 1, name: 'Produto 1', price: 10, quantity: 5 },
        { id: 2, user_id: 1, name: 'Produto 2', price: 20, quantity: 3 },
      ];

      mockProdutoRepository.find.mockResolvedValue(products);

      const result = await service.findAll(userId);

      expect(mockProdutoRepository.find).toHaveBeenCalledWith({ where: { user_id: userId } });
      expect(result).toEqual(products);
    });
  });

  describe('findOne', () => {
    it('should return a product by id and userId', async () => {
      const product = {
        id: 1,
        user_id: 1,
        name: 'Produto Teste',
        price: 99.99,
        quantity: 10,
      };
 
      mockProdutoRepository.findOneBy.mockResolvedValue(product);
 
      const result = await service.findOne(1, 1);
 
      expect(mockProdutoRepository.findOneBy).toHaveBeenCalledWith({ id: 1, user_id: 1 });
      expect(result).toEqual(product);
    });

    it('should throw NotFoundException when product is not found or belongs to another user', async () => {
      mockProdutoRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(999, 1)).rejects.toThrow(NotFoundException);
      expect(mockProdutoRepository.findOneBy).toHaveBeenCalledWith({ id: 999, user_id: 1 });
    });
  });

  describe('update', () => {
    it('should update a product with userId verification', async () => {
      const updateDto = { name: 'Produto Atualizado' };
      const preloadedProduct = {
        id: 1,
        user_id: 1,
        name: 'Produto Antigo',
        price: 99.99,
        quantity: 10,
      };
      const savedProduct = { ...preloadedProduct, ...updateDto };

      mockProdutoRepository.preload.mockResolvedValue(preloadedProduct);
      mockProdutoRepository.save.mockResolvedValue(savedProduct);

      const result = await service.update(1, 1, updateDto);

      expect(mockProdutoRepository.preload).toHaveBeenCalledWith({
        id: 1,
        user_id: 1,
        ...updateDto,
      });
      expect(mockProdutoRepository.save).toHaveBeenCalledWith(preloadedProduct);
      expect(result).toEqual(savedProduct);
    });

    it('should throw NotFoundException when product to update is not found', async () => {
      mockProdutoRepository.preload.mockResolvedValue(null);

      await expect(service.update(999, 1, { name: 'Teste' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a product with userId verification', async () => {
      mockProdutoRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(1, 1);

      expect(mockProdutoRepository.delete).toHaveBeenCalledWith({ id: 1, user_id: 1 });
    });

    it('should throw NotFoundException when product to delete is not found or belongs to another user', async () => {
      mockProdutoRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(999, 1)).rejects.toThrow(NotFoundException);
      expect(mockProdutoRepository.delete).toHaveBeenCalledWith({ id: 999, user_id: 1 });
    });
  });
});
