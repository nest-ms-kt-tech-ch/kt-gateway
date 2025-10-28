import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { USER_SERVICE } from 'src/config';
import { GetTokenDto } from './dto/get-token.dto';

@Controller('auth')
export class AuthController {
  constructor(@Inject(USER_SERVICE) private readonly userClient: ClientProxy) {}

  @Post('token')
  async getToken(@Body() getTokenDto: GetTokenDto) {
    try {
      const token = await firstValueFrom(
        this.userClient.send({ cmd: 'create-jwt' }, getTokenDto),
      );
      return token;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
