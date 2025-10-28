import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { MOVIE_SERVICE } from 'src/config';
import { FindMoviesDto } from './dto/find-movies.dto';

@Controller('movies')
export class MoviesController {
  constructor(
    @Inject(MOVIE_SERVICE) private readonly movieClient: ClientProxy,
  ) {}

  @Get()
  async findMovies(@Query() findMoviesDto: FindMoviesDto) {
    try {
      const movies = await firstValueFrom(
        this.movieClient.send({ cmd: 'search_movies' }, findMoviesDto
      ))
      return movies;
    } catch (error) {
      throw new RpcException(error)
    }
  }

  @Get('recomendations')
  async findOne() {
    try {
      const movies = await firstValueFrom(
        this.movieClient.send({ cmd: 'recommend_movies' }, {}
      ))
      return movies;
    } catch (error) {
      throw new RpcException(error)
    }
  }
}
