import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdateUserDto } from './update-user.dto';

describe('UpdateUserDto', () => {
  it('allows empty payload (partial)', async () => {
    const dto = plainToInstance(UpdateUserDto, {});
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('validates fields if provided', async () => {
    const dto = plainToInstance(UpdateUserDto, { email: 'bad' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
