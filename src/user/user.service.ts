import { HttpException, Inject, Injectable } from '@nestjs/common';
import {
  LoginUserRequest,
  RegisterUserRequest,
  UpdateUserRequest,
  UserResponse,
} from '../model/user.model';
import { ValidationService } from '../common/validation.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private readonly validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly prismaService: PrismaService,
  ) {}

  async register(request: RegisterUserRequest): Promise<UserResponse> {
    this.logger.debug(`UserService -> register = ${JSON.stringify(request)}`);

    const payload = this.validationService.validate<RegisterUserRequest>(
      UserValidation.REGISTER,
      request,
    );

    const isUserExist = await this.prismaService.user.count({
      where: {
        username: payload.username,
      },
    });

    if (isUserExist) {
      throw new HttpException('User already exists.', 400);
    }

    payload.password = await bcrypt.hash(
      payload.password,
      await bcrypt.genSalt(),
    );

    const user = await this.prismaService.user.create({
      data: payload,
    });

    return {
      username: user.username,
      name: user.name,
    };
  }

  async login(request: LoginUserRequest): Promise<UserResponse> {
    this.logger.info(`UserService -> login = ${JSON.stringify(request)}`);

    const payload = this.validationService.validate<LoginUserRequest>(
      UserValidation.LOGIN,
      request,
    );

    const existingUser = await this.prismaService.user.findUnique({
      where: {
        username: payload.username,
      },
    });

    if (!existingUser) {
      throw new HttpException('Invalid credentials.', 401);
    }

    const isPasswordMatch = await bcrypt.compare(
      payload.password,
      existingUser.password,
    );

    if (!isPasswordMatch) {
      throw new HttpException('Invalid credentials.', 401);
    }

    const user = await this.prismaService.user.update({
      where: {
        username: existingUser.username,
      },
      data: {
        token: uuid(),
      },
    });

    return {
      username: user.username,
      name: user.name,
      token: user.token,
    };
  }

  async get(user: User): Promise<UserResponse> {
    this.logger.info(`UserService -> get = ${JSON.stringify(user)}`);

    return {
      username: user.username,
      name: user.name,
    };
  }

  async getAll(): Promise<Pick<User, 'id' | 'username' | 'name'>[]> {
    this.logger.info('UserService -> getAll');

    const users = await this.prismaService.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
      },
    });

    if (!users.length) {
      throw new HttpException('Users not found.', 404);
    }

    return users;
  }

  async update(user: User, request: UpdateUserRequest): Promise<UserResponse> {
    this.logger.info(
      `UserService -> update = ${JSON.stringify(user)}, ${JSON.stringify(request)}`,
    );
    return null;
  }
}
