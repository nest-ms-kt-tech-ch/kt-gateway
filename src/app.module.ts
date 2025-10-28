import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { MoviesModule } from './movies/movies.module';
import { AuthModule } from './auth/auth.module';
import { envs } from './config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [UsersModule, MoviesModule, AuthModule, JwtModule.register({
    global: true, secret: envs.JWT_SECRET,
  })],
  controllers: [],
  providers: [],
})
export class AppModule {}
