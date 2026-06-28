import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('should call authService.login with email and password', async () => {
      const signInDto = { email: 'test@test.com', password: 'password123' };
      const expectedResult = { access_token: 'token123' };

      mockAuthService.login.mockResolvedValue(expectedResult);

      const result = await controller.signIn(signInDto);

      expect(mockAuthService.login).toHaveBeenCalledWith(
        'test@test.com',
        'password123',
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('register', () => {
    it('should call authService.register with name, email and password', async () => {
      const registerDto = {
        name: 'Test User',
        email: 'test@test.com',
        password: 'password123',
      };
      const expectedResult = { id: 1, name: 'Test User', email: 'test@test.com' };

      mockAuthService.register.mockResolvedValue(expectedResult);

      const result = await controller.register(registerDto);

      expect(mockAuthService.register).toHaveBeenCalledWith(
        'Test User',
        'test@test.com',
        'password123',
      );
      expect(result).toEqual(expectedResult);
    });
  });
});
