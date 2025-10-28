import { AuthController } from './auth.controller';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { of, throwError } from 'rxjs';
import { GetTokenDto } from './dto/get-token.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let userClient: jest.Mocked<ClientProxy>;

  beforeEach(() => {
    userClient = { send: jest.fn() } as any;
    controller = new AuthController(userClient);
  });

  it('should return a token on success', async () => {
    const dto: GetTokenDto = { userId: 'user-1' };
    userClient.send.mockReturnValue(of({ access_token: 'abc' } as any));

    await expect(controller.getToken(dto)).resolves.toEqual({
      access_token: 'abc',
    });
    expect(userClient.send).toHaveBeenCalledWith({ cmd: 'create-jwt' }, dto);
  });

  it('should throw RpcException when microservice errors', async () => {
    const dto: GetTokenDto = { userId: 'user-1' };
    const err = { status: 400, message: 'bad request' };
    userClient.send.mockReturnValue(throwError(() => err));

    await expect(controller.getToken(dto)).rejects.toBeInstanceOf(RpcException);
  });
});
