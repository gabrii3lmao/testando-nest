import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    process.env.JWT_SECRET = 'test-secret-key';

    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return userId and email from the payload', async () => {
      const payload = { sub: '1', email: 'test@test.com' };

      const result = await strategy.validate(payload as any);

      expect(result).toEqual({ userId: 1, email: 'test@test.com' });
    });

    it('should convert sub to number', async () => {
      const payload = { sub: '42', email: 'user@test.com' };

      const result = await strategy.validate(payload as any);

      expect(result.userId).toBe(42);
    });
  });
});
