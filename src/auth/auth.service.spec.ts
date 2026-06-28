import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUserService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token when credentials are valid', async () => {
      const user = {
        id: 1,
        email: 'test@test.com',
        password: 'hashedpassword',
        name: 'Test',
      };
      mockUserService.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('token123');

      const result = await service.login('test@test.com', 'password123');

      expect(mockUserService.findByEmail).toHaveBeenCalledWith('test@test.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword');
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: 1,
        email: 'test@test.com',
      });
      expect(result).toEqual({ access_token: 'token123' });
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      mockUserService.findByEmail.mockResolvedValue(null);

      await expect(
        service.login('unknown@test.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);

      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(mockJwtService.signAsync).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
      const user = {
        id: 1,
        email: 'test@test.com',
        password: 'hashedpassword',
        name: 'Test',
      };
      mockUserService.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login('test@test.com', 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);

      expect(mockJwtService.signAsync).not.toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('should create a user when email does not exist', async () => {
      const createdUser = {
        id: 1,
        name: 'Test',
        email: 'test@test.com',
      };
      mockUserService.findByEmail.mockResolvedValue(null);
      mockUserService.create.mockResolvedValue(createdUser);

      const result = await service.register('Test', 'test@test.com', 'password123');

      expect(mockUserService.findByEmail).toHaveBeenCalledWith('test@test.com');
      expect(mockUserService.create).toHaveBeenCalledWith({
        name: 'Test',
        email: 'test@test.com',
        password: 'password123',
      });
      expect(result).toEqual(createdUser);
    });

    it('should throw ConflictException when email already exists', async () => {
      const existingUser = {
        id: 1,
        email: 'test@test.com',
        name: 'Existing',
        password: 'hash',
      };
      mockUserService.findByEmail.mockResolvedValue(existingUser);

      await expect(
        service.register('Test', 'test@test.com', 'password123'),
      ).rejects.toThrow(ConflictException);

      expect(mockUserService.create).not.toHaveBeenCalled();
    });
  });
});
