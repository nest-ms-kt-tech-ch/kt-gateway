import * as Config from './index';

describe('config index exports', () => {
  it('re-exports expected members', () => {
    expect(Config).toHaveProperty('envs');
    expect(Config).toHaveProperty('USER_SERVICE');
    expect(Config).toHaveProperty('MOVIE_SERVICE');
  });
});
