import { CurrentUser } from './current-user.decorator';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';

function getParamDecoratorFactory(decorator: Function) {
  class TestDecorator {
    public test(@decorator() value: any) {}
  }
  const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, TestDecorator, 'test');
  return args[Object.keys(args)[0]].factory;
}

describe('CurrentUser Decorator', () => {
  it('should extract userId from request.user', () => {
    const factory = getParamDecoratorFactory(CurrentUser);
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { userId: 42, email: 'test@test.com' },
        }),
      }),
    };

    const result = factory(undefined, mockContext);

    expect(result).toBe(42);
  });

  it('should return undefined when request.user is undefined', () => {
    const factory = getParamDecoratorFactory(CurrentUser);
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({}),
      }),
    };

    const result = factory(undefined, mockContext);

    expect(result).toBeUndefined();
  });
});
