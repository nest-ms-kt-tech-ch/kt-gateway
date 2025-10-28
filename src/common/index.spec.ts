import * as Common from './index';

describe('common index exports', () => {
  it('re-exports expected members', () => {
    expect(Common).toHaveProperty('PaginationDto');
    expect(Common).toHaveProperty('RpcCustomExceptionFilter');
  });
});
