import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { USER_SERVICE } from 'src/config';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/common/auth/auth.guard';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger('UserController');
  constructor(@Inject(USER_SERVICE) private readonly userClient: ClientProxy) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await firstValueFrom(
        this.userClient.send({ cmd: 'create_user' }, createUserDto),
      );
      return user;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get()
  @UseGuards(AuthGuard)
  async getUsers(@Query() paginationDto: PaginationDto) {
    try {
      const users = await firstValueFrom(
        this.userClient.send({ cmd: 'find_all_users' }, paginationDto),
      );
      return users;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  async getProfile(@Req() req: any) {
    try {
      const profile = await firstValueFrom(
        this.userClient.send(
          { cmd: 'get-user-profile' },
          {
            id: req.user.userId,
          },
        ),
      );
      return profile;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Post('follow/:id')
  @UseGuards(AuthGuard)
  async followUser(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    try {
      this.logger.log(req.user);
      const follow = await firstValueFrom(
        this.userClient.send(
          { cmd: 'follow-user' },
          {
            followTo: id,
            id: req.user.userId,
          },
        ),
      );
      return follow;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Delete('follow/:id')
  @UseGuards(AuthGuard)
  async unfollowUser(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    try {
      this.logger.log(req.user);
      const follow = await firstValueFrom(
        this.userClient.send(
          { cmd: 'unfollow-user' },
          {
            unfollowTo: id,
            id: req.user.userId,
          },
        ),
      );
      return follow;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getUserById(@Param('id') id: string) {
    try {
      const user = await firstValueFrom(
        this.userClient.send({ cmd: 'find_one_user' }, { id }),
      );
      return user;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteUser(@Param('id') id: string) {
    try {
      const result = await firstValueFrom(
        this.userClient.send({ cmd: 'remove_user' }, { id }),
      );
      return result;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      const updatedUser = await firstValueFrom(
        this.userClient.send({ cmd: 'update_user' }, { id, ...updateUserDto }),
      );
      return updatedUser;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
