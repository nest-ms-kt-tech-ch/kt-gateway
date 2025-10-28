import { RpcException } from '@nestjs/microservices';
import { RpcCustomExceptionFilter } from './rpc-custom-exception.filter';

describe('RpcCustomExceptionFilter', () => {
  const makeHost = (statusSpy: jest.Mock, jsonSpy: jest.Mock) =>
    ({
      switchToHttp: () => ({
        getResponse: () => ({
          status: statusSpy.mockReturnValue({ json: jsonSpy }),
        }),
      }),
    }) as any;

  it('maps rpc error object with status and message', () => {
    const statusSpy = jest.fn();
    const jsonSpy = jest.fn();
    const host = makeHost(statusSpy, jsonSpy);

    new RpcCustomExceptionFilter().catch(
      new RpcException({ status: 404, message: 'Not found' }),
      host,
    );

    expect(statusSpy).toHaveBeenCalledWith(404);
    expect(jsonSpy).toHaveBeenCalledWith({ status: 404, message: 'Not found' });
  });

  it('defaults to 500 when error shape is unknown', () => {
    const statusSpy = jest.fn();
    const jsonSpy = jest.fn();
    const host = makeHost(statusSpy, jsonSpy);

    new RpcCustomExceptionFilter().catch(new RpcException('oops'), host);

    expect(statusSpy).toHaveBeenCalledWith(500);
    expect(jsonSpy).toHaveBeenCalledWith({
      status: 500,
      message: 'Internal server error',
    });
  });
});
