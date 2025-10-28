import { MoviesController } from './movies.controller';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { of, throwError } from 'rxjs';
import { FindMoviesDto } from './dto/find-movies.dto';

describe('MoviesController', () => {
  let controller: MoviesController;
  let movieClient: jest.Mocked<ClientProxy>;
  let userClient: jest.Mocked<ClientProxy>;

  beforeEach(() => {
    movieClient = { send: jest.fn() } as any;
    userClient = { send: jest.fn() } as any;
    controller = new MoviesController(movieClient, userClient);
  });

  it('findMovies returns movies on success', async () => {
    const dto: FindMoviesDto = { title: 'Star', year: 2000, page: 1 } as any;
    movieClient.send.mockReturnValue(of([{ id: 1 }] as any));
    await expect(controller.findMovies(dto)).resolves.toEqual([{ id: 1 }]);
    expect(movieClient.send).toHaveBeenCalledWith(
      { cmd: 'search_movies' },
      dto,
    );
  });

  it('findMovies throws RpcException on error', async () => {
    movieClient.send.mockReturnValue(
      throwError(() => ({ status: 500 })) as any,
    );
    await expect(
      controller.findMovies({ title: 'X' } as any),
    ).rejects.toBeInstanceOf(RpcException);
  });

  it('findOne returns recommendations', async () => {
    movieClient.send.mockReturnValue(of(['a', 'b'] as any));
    await expect(controller.findOne()).resolves.toEqual(['a', 'b']);
    expect(movieClient.send).toHaveBeenCalledWith(
      { cmd: 'recommend_movies' },
      {},
    );
  });
});
