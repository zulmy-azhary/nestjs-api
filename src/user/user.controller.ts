import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { WebResponse } from '../model/web.model';
import {
  LoginUserRequest,
  RegisterUserRequest,
  UserResponse,
} from '../model/user.model';
import { Auth } from '../common/auth.decorator';
import { User } from '@prisma/client';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  @HttpCode(200)
  async register(
    @Body() request: RegisterUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.register(request);

    return {
      data: result,
    };
  }

  @Post('/login')
  @HttpCode(200)
  async login(
    @Body() request: LoginUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.login(request);

    return {
      data: result,
    };
  }

  @Get()
  @HttpCode(200)
  async all(): Promise<WebResponse<Pick<User, 'id' | 'username' | 'name'>[]>> {
    const result = await this.userService.getAll();

    return {
      data: result,
    };
  }

  @Get('/current')
  @HttpCode(200)
  async get(@Auth() user: User): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.get(user);

    return {
      data: result,
    };
  }
}
