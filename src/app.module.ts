import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [UserModule, CommonModule],
  controllers: [AppController],
})
export class AppModule {}
