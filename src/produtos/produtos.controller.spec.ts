import { Test, TestingModule } from '@nestjs/testing';
import { ProdutosController } from './produtos.controller';
import { ProdutosService } from './produtos.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/produto.entity';

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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return the result', async () => {
      const createDto = {
        userId: 1,
        name: 'Produto Teste',
        price: 50,
        quantity: 5,
      };
      const expectedProduct = { id: 1, ...createDto };

      jest.spyOn(service, 'create').mockResolvedValue(expectedProduct);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expectedProduct);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll and return the result', async () => {
      const products = [
        { id: 1, userId: 1, name: 'Produto 1', price: 10, quantity: 5 },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(products);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(products);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with numeric id', async () => {
      const product = {
        id: 1,
        userId: 1,
        name: 'Produto Teste',
        price: 50,
        quantity: 5,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(product);

      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(product);
    });
  });

  describe('update', () => {
    it('should call service.update with numeric id and dto', async () => {
      const updateDto = { name: 'Atualizado' };
      const updatedProduct = {
        id: 1,
        userId: 1,
        name: 'Atualizado',
        price: 50,
        quantity: 5,
      };

      jest.spyOn(service, 'update').mockResolvedValue(updatedProduct);

      const result = await controller.update('1', updateDto);

      expect(service.update).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual(updatedProduct);
    });
  });

  describe('remove', () => {
    it('should call service.remove with numeric id', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      const result = await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });
  });
});
