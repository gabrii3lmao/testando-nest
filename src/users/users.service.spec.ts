import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/usuario.entity';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UserService', () => {
  let service: UserService;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    preload: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should hash password and return user without password', async () => {
      const createDto = {
        name: 'Test',
        email: 'test@test.com',
        password: 'plaintext',
      };
      const hashedPassword = 'hashedpassword';
      const savedUser = {
        id: 1,
        name: 'Test',
        email: 'test@test.com',
        password: hashedPassword,
      };
      const expectedResult = { id: 1, name: 'Test', email: 'test@test.com' };

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockUserRepository.create.mockReturnValue(savedUser);
      mockUserRepository.save.mockResolvedValue(savedUser);

      const result = await service.create(createDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('plaintext', 10);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...createDto,
        password: hashedPassword,
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(savedUser);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      const user = { id: 1, name: 'Test', email: 'test@test.com' };
      mockUserRepository.findOneBy.mockResolvedValue(user);

      const result = await service.findByEmail('test@test.com');

      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
        email: 'test@test.com',
      });
      expect(result).toEqual(user);
    });

    it('should return null when user is not found', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);

      const result = await service.findByEmail('notfound@test.com');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateDto = { name: 'Updated Name' };
      const preloadedUser = {
        id: 1,
        name: 'Old Name',
        email: 'test@test.com',
      };
      const savedUser = {
        id: 1,
        name: 'Updated Name',
        email: 'test@test.com',
      };

      mockUserRepository.preload.mockResolvedValue(preloadedUser);
      mockUserRepository.save.mockResolvedValue(savedUser);

      const result = await service.update(1, updateDto);

      expect(mockUserRepository.preload).toHaveBeenCalledWith({
        id: 1,
        ...updateDto,
      });
      expect(mockUserRepository.save).toHaveBeenCalledWith(preloadedUser);
      expect(result).toEqual(savedUser);
    });

    it('should throw NotFoundException when user to update is not found', async () => {
      mockUserRepository.preload.mockResolvedValue(null);

      await expect(service.update(999, { name: 'Test' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      mockUserRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(1);

      expect(mockUserRepository.delete).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException when user to delete is not found', async () => {
      mockUserRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      expect(mockUserRepository.delete).toHaveBeenCalledWith({ id: 999 });
    });
  });
});
