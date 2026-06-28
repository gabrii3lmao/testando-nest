import { Test, TestingModule } from '@nestjs/testing';
import { ProdutosController } from './products.controller';
import { ProdutosService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';

describe('ProdutosController', () => {
  let controller: ProdutosController;
  let service: ProdutosService;

  const mockRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    preload: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProdutosController],
      providers: [
        ProdutosService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepository,
        },
      ],
    }).compile();

    controller = module.get<ProdutosController>(ProdutosController);
    service = module.get<ProdutosService>(ProdutosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create with body and userId from the authenticated user', async () => {
      const createDto = { name: 'Produto Teste', price: 50, quantity: 5 };
      const userId = 1;
      const expectedProduct = { id: 1, user_id: userId, ...createDto };

      jest.spyOn(service, 'create').mockResolvedValue(expectedProduct as any);

      const result = await controller.create(createDto as any, userId);

      expect(service.create).toHaveBeenCalledWith({ ...createDto, user_id: userId });
      expect(result).toEqual(expectedProduct);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll with userId from the authenticated user', async () => {
      const userId = 1;
      const products = [
        { id: 1, user_id: 1, name: 'Produto 1', price: 10, quantity: 5 },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(products as any);

      const result = await controller.findAll(userId);

      expect(service.findAll).toHaveBeenCalledWith(userId);
      expect(result).toEqual(products);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with numeric id and userId', async () => {
      const userId = 1;
      const product = {
        id: 1,
        user_id: 1,
        name: 'Produto Teste',
        price: 50,
        quantity: 5,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(product as any);

      const result = await controller.findOne('1', userId);

      expect(service.findOne).toHaveBeenCalledWith(1, userId);
      expect(result).toEqual(product);
    });
  });

  describe('update', () => {
    it('should call service.update with numeric id, userId and dto', async () => {
      const userId = 1;
      const updateDto = { name: 'Atualizado' };
      const updatedProduct = {
        id: 1,
        user_id: 1,
        name: 'Atualizado',
        price: 50,
        quantity: 5,
      };

      jest.spyOn(service, 'update').mockResolvedValue(updatedProduct as any);

      const result = await controller.update('1', userId, updateDto);

      expect(service.update).toHaveBeenCalledWith(1, userId, updateDto);
      expect(result).toEqual(updatedProduct);
    });
  });

  describe('remove', () => {
    it('should call service.remove with numeric id and userId', async () => {
      const userId = 1;

      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      const result = await controller.remove('1', userId);

      expect(service.remove).toHaveBeenCalledWith(1, userId);
      expect(result).toBeUndefined();
    });
  });
});
