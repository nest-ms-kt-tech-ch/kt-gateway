import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { PaginationDto } from './pagination.dto';

describe('PaginationDto', () => {
  it('uses defaults when not provided', async () => {
    const dto = plainToInstance(PaginationDto, {});
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
    expect(dto.page).toBe(1);
    expect(dto.limit).toBe(10);
  });

  it('rejects non-positive values', async () => {
    const dto = plainToInstance(PaginationDto, { page: 0, limit: -1 });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
