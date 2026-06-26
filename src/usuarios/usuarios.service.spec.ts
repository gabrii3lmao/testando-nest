import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosService } from './usuarios.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/usuario.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsuariosService', () => {
  let service: UsuariosService;

  const mockUsuarioRepository = {
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
        UsuariosService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsuarioRepository,
        },
      ],
    }).compile();

    service = module.get<UsuariosService>(UsuariosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createDto = {
        name: 'João',
        email: 'joao@email.com',
        password: '123456',
      };
      const expectedUser = { id: 1, ...createDto };

      mockUsuarioRepository.create.mockReturnValue(expectedUser);
      mockUsuarioRepository.save.mockResolvedValue(expectedUser);

      const result = await service.create(createDto);

      expect(mockUsuarioRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockUsuarioRepository.save).toHaveBeenCalledWith(expectedUser);
      expect(result).toEqual(expectedUser);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [
        { id: 1, name: 'João', email: 'joao@email.com', password: '123456' },
        { id: 2, name: 'Maria', email: 'maria@email.com', password: '654321' },
      ];

      mockUsuarioRepository.find.mockResolvedValue(users);

      const result = await service.findAll();

      expect(mockUsuarioRepository.find).toHaveBeenCalled();
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user = { id: 1, name: 'João', email: 'joao@email.com', password: '123456' };

      mockUsuarioRepository.findOneBy.mockResolvedValue(user);

      const result = await service.findOne(1);

      expect(mockUsuarioRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(user);
    });

    it('should throw NotFoundException when user is not found', async () => {
      mockUsuarioRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      expect(mockUsuarioRepository.findOneBy).toHaveBeenCalledWith({ id: 999 });
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateDto = { name: 'João Atualizado' };
      const preloadedUser = { id: 1, name: 'João', email: 'joao@email.com', password: '123456' };
      const savedUser = { ...preloadedUser, ...updateDto };

      mockUsuarioRepository.preload.mockResolvedValue(preloadedUser);
      mockUsuarioRepository.save.mockResolvedValue(savedUser);

      const result = await service.update(1, updateDto);

      expect(mockUsuarioRepository.preload).toHaveBeenCalledWith({ id: 1, ...updateDto });
      expect(mockUsuarioRepository.save).toHaveBeenCalledWith(preloadedUser);
      expect(result).toEqual(savedUser);
    });

    it('should throw NotFoundException when user to update is not found', async () => {
      mockUsuarioRepository.preload.mockResolvedValue(null);

      await expect(service.update(999, { name: 'Teste' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      mockUsuarioRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(1);

      expect(mockUsuarioRepository.delete).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException when user to delete is not found', async () => {
      mockUsuarioRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      expect(mockUsuarioRepository.delete).toHaveBeenCalledWith({ id: 999 });
    });
  });
});
