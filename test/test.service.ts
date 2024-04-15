import { Injectable } from '@nestjs/common';
import { PrismaService } from '../src/common/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class TestService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser() {
    await this.prismaService.user.create({
      data: {
        username: 'test',
        password: await bcrypt.hash('test', await bcrypt.genSalt()),
        name: 'John Doe',
        token: 'test',
      },
    });
  }

  async deleteAll() {
    await this.deleteUser();
  }

  async deleteUser() {
    await this.prismaService.user.deleteMany({
      where: {
        username: 'test',
      },
    });
  }
}
