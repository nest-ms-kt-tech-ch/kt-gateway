import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';

const createContext = (headers: Record<string, string | undefined>) =>
  ({
    switchToHttp: () => ({ getRequest: () => ({ headers }) }),
  }) as any;

describe('AuthGuard', () => {
  it('allows when Bearer token is valid', async () => {
    const jwt = {
      verifyAsync: jest.fn().mockResolvedValue({ userId: 1 }),
    } as unknown as JwtService;
    const guard = new AuthGuard(jwt);
    const can = await guard.canActivate(
      createContext({ authorization: 'Bearer token' }),
    );
    expect(can).toBe(true);
    expect((jwt as any).verifyAsync).toHaveBeenCalled();
  });

  it('throws when Authorization header missing', async () => {
    const jwt = { verifyAsync: jest.fn() } as unknown as JwtService;
    const guard = new AuthGuard(jwt);
    await expect(guard.canActivate(createContext({}))).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('throws when token verification fails', async () => {
    const jwt = {
      verifyAsync: jest.fn().mockRejectedValue(new Error('bad')),
    } as unknown as JwtService;
    const guard = new AuthGuard(jwt);
    await expect(
      guard.canActivate(createContext({ authorization: 'Bearer token' })),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
