import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto', () => {
  it('valid when name and email valid', async () => {
    const dto = plainToInstance(CreateUserDto, {
      name: 'Al',
      email: 'a@a.com',
    });
    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });

  it('invalid when name too short or email invalid', async () => {
    const dto = plainToInstance(CreateUserDto, { name: 'A', email: 'bad' });
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });
});
