import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { MOVIE_SERVICE, USER_SERVICE } from 'src/config';
import { FindMoviesDto } from './dto/find-movies.dto';
import { AuthGuard } from 'src/common/auth/auth.guard';

@Controller('movies')
export class MoviesController {
  constructor(
    @Inject(MOVIE_SERVICE) private readonly movieClient: ClientProxy,
    @Inject(USER_SERVICE) private readonly userClient: ClientProxy,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
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

  @Post(':id/favorite')
  @UseGuards(AuthGuard)
  async markAsFavorite(
    @Param('id') id: string,
    @Req() req: any
  ) {
    try {
      const response = await firstValueFrom(
        this.userClient.send({cmd: 'mark-movie-as-favorite'}, {
          userId: req.user.userId,
          movieId: id
        })
      )
      return response
    } catch (error) {
      throw new RpcException(error)
    }
  }

  @Delete(':id/favorite')
  @UseGuards(AuthGuard)
  async unmarkAsFavorite(
    @Param('id') id: string,
    @Req() req: any
  ) {
    try {
      const response = await firstValueFrom(
        this.userClient.send({cmd: 'unmark-movie-as-favorite'}, {
          userId: req.user.userId,
          movieId: id
        })
      )
      return response
    } catch (error) {
      throw new RpcException(error)
    }
  }

  @Post(':id/comment')
  @UseGuards(AuthGuard)
  async addComment(
    @Param('id') id: string,
    @Body() body: { comment: string },
    @Req() req: any
  ) {
    try {
      const response = await firstValueFrom(
        this.userClient.send({cmd: 'comment-movie'}, {
          userId: req.user.userId,
          movieId: id,
          comment: body.comment
        })
      )
      return response
    } catch (error) {
      throw new RpcException(error)
    }
  }
}
