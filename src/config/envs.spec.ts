import { envs } from './envs';

describe('envs', () => {
  it('provides defaulted configuration values', () => {
    expect(envs).toHaveProperty('PORT');
    expect(envs).toHaveProperty('USER_MICROSERVICE_HOST');
    expect(envs).toHaveProperty('USER_MICROSERVICE_PORT');
    expect(envs).toHaveProperty('MOVIE_MICROSERVICE_HOST');
    expect(envs).toHaveProperty('MOVIE_MICROSERVICE_PORT');
    expect(envs).toHaveProperty('JWT_SECRET');
  });
});
