import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';

describe('UsuariosController', () => {
  let controller: UsuariosController;
  let service: UsuariosService;

  const mockUsuariosService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuariosController],
      providers: [
        {
          provide: UsuariosService,
          useValue: mockUsuariosService,
        },
      ],
    }).compile();

    controller = module.get<UsuariosController>(UsuariosController);
    service = module.get<UsuariosService>(UsuariosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return the result', async () => {
      const createDto = { name: 'João', email: 'joao@email.com', password: '123456' };
      const expectedUser = { id: 1, ...createDto };

      mockUsuariosService.create.mockResolvedValue(expectedUser);

      const result = await controller.create(createDto);

      expect(mockUsuariosService.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(expectedUser);
    });
  });

  describe('findAll', () => {
    it('should call service.findAll and return the result', async () => {
      const users = [
        { id: 1, name: 'João', email: 'joao@email.com', password: '123456' },
      ];

      mockUsuariosService.findAll.mockResolvedValue(users);

      const result = await controller.findAll();

      expect(mockUsuariosService.findAll).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with numeric id', async () => {
      const user = { id: 1, name: 'João', email: 'joao@email.com', password: '123456' };

      mockUsuariosService.findOne.mockResolvedValue(user);

      const result = await controller.findOne('1');

      expect(mockUsuariosService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(user);
    });
  });

  describe('update', () => {
    it('should call service.update with numeric id and dto', async () => {
      const updateDto = { name: 'João Atualizado' };
      const updatedUser = { id: 1, name: 'João Atualizado', email: 'joao@email.com', password: '123456' };

      mockUsuariosService.update.mockResolvedValue(updatedUser);

      const result = await controller.update('1', updateDto);

      expect(mockUsuariosService.update).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('remove', () => {
    it('should call service.remove with numeric id', async () => {
      mockUsuariosService.remove.mockResolvedValue(undefined);

      const result = await controller.remove('1');

      expect(mockUsuariosService.remove).toHaveBeenCalledWith(1);
      expect(result).toBeUndefined();
    });
  });
});
