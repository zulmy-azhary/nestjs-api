import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHealth(): { statusCode: number; message: string } {
    return {
      statusCode: 200,
      message: 'Server is running',
    };
  }
}
