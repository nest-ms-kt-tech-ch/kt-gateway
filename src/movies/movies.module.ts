import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, MOVIE_SERVICE } from 'src/config';

@Module({
  controllers: [MoviesController],
  providers: [],
  imports: [
    ClientsModule.register([
      {
        name: MOVIE_SERVICE,
        transport: Transport.TCP,
        options: {
          host: envs.MOVIE_MICROSERVICE_HOST,
          port: envs.MOVIE_MICROSERVICE_PORT,
        },
      },
    ]),
  ],
})
export class MoviesModule {}
