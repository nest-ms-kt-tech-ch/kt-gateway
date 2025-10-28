import { UsersController } from './users.controller';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { of, throwError } from 'rxjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const reqWithUser = (id = 1) => ({ user: { userId: id } });

describe('UsersController', () => {
  let controller: UsersController;
  let userClient: jest.Mocked<ClientProxy>;

  beforeEach(() => {
    userClient = { send: jest.fn() } as any;
    controller = new UsersController(userClient);
  });

  it('createUser returns created user', async () => {
    const dto: CreateUserDto = { name: 'A', email: 'a@a.com' } as any;
    userClient.send.mockReturnValue(of({ id: 1, ...dto } as any));
    await expect(controller.createUser(dto)).resolves.toMatchObject({ id: 1 });
    expect(userClient.send).toHaveBeenCalledWith({ cmd: 'create_user' }, dto);
  });

  it('getUsers returns list', async () => {
    userClient.send.mockReturnValue(of([{ id: 1 }] as any));
    await expect(
      controller.getUsers({ page: 1, limit: 10 } as any),
    ).resolves.toEqual([{ id: 1 }]);
    expect(userClient.send).toHaveBeenCalledWith(
      { cmd: 'find_all_users' },
      { page: 1, limit: 10 },
    );
  });

  it('getProfile proxies to microservice', async () => {
    userClient.send.mockReturnValue(of({ id: 1 } as any));
    await expect(controller.getProfile(reqWithUser())).resolves.toEqual({
      id: 1,
    });
    expect(userClient.send).toHaveBeenCalledWith(
      { cmd: 'get-user-profile' },
      { id: 1 },
    );
  });

  it('follow/unfollow user', async () => {
    userClient.send.mockReturnValueOnce(of(true as any));
    await expect(controller.followUser(2, reqWithUser())).resolves.toBeTruthy();
    expect(userClient.send).toHaveBeenCalledWith(
      { cmd: 'follow-user' },
      { followTo: 2, id: 1 },
    );

    userClient.send.mockReturnValueOnce(of(true as any));
    await expect(
      controller.unfollowUser(2, reqWithUser()),
    ).resolves.toBeTruthy();
    expect(userClient.send).toHaveBeenCalledWith(
      { cmd: 'unfollow-user' },
      { unfollowTo: 2, id: 1 },
    );
  });


  it('getUserById and deleteUser and updateUser', async () => {
    userClient.send.mockReturnValueOnce(of({ id: '1' } as any));
    await expect(controller.getUserById('1')).resolves.toEqual({ id: '1' });
    expect(userClient.send).toHaveBeenCalledWith(
      { cmd: 'find_one_user' },
      { id: '1' },
    );

    userClient.send.mockReturnValueOnce(of(true as any));
    await expect(controller.deleteUser('1')).resolves.toBeTruthy();
    expect(userClient.send).toHaveBeenCalledWith(
      { cmd: 'remove_user' },
      { id: '1' },
    );

    userClient.send.mockReturnValueOnce(of({ id: 1 } as any));
    await expect(
      controller.updateUser(1, { name: 'B' } as UpdateUserDto),
    ).resolves.toEqual({ id: 1 });
    expect(userClient.send).toHaveBeenCalledWith(
      { cmd: 'update_user' },
      { id: 1, name: 'B' },
    );
  });

  it('wraps errors in RpcException', async () => {
    userClient.send.mockReturnValue(throwError(() => ({ status: 400 })) as any);
    await expect(controller.createUser({} as any)).rejects.toBeInstanceOf(
      RpcException,
    );
  });
});
