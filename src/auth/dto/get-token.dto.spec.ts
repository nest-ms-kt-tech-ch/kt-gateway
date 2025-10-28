import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { GetTokenDto } from './get-token.dto';

describe('GetTokenDto', () => {
  it('validates a correct payload', async () => {
    const dto = plainToInstance(GetTokenDto, { userId: 'user-1' });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('fails when userId is missing', async () => {
    const dto = plainToInstance(GetTokenDto, {});
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
