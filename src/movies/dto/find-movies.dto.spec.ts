import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { FindMoviesDto } from './find-movies.dto';

describe('FindMoviesDto', () => {
  it('valid when title present and optional fields valid', async () => {
    const dto = plainToInstance(FindMoviesDto, {
      title: 'Matrix',
      year: 1999,
      page: 1,
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('invalid when title missing or too short', async () => {
    const dto = plainToInstance(FindMoviesDto, { title: '' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('invalid when year/page out of range', async () => {
    const dto = plainToInstance(FindMoviesDto, {
      title: 'X',
      year: 1800,
      page: 0,
    });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
