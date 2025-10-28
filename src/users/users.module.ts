import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, USER_SERVICE } from 'src/config';

@Module({
  controllers: [UsersController],
  providers: [],
  imports: [
    ClientsModule.register([
      {
        name: USER_SERVICE,
        transport: Transport.TCP,
        options: {
          host: envs.USER_MICROSERVICE_HOST,
          port: envs.USER_MICROSERVICE_PORT,
        },
      },
    ]),
  ],
})
export class UsersModule {}
