import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ZodError } from 'zod';

@Catch(ZodError, HttpException)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    if (exception instanceof HttpException) {
      return response.status(exception.getStatus()).json({
        errors: exception.getResponse(),
      });
    }

    if (exception instanceof ZodError) {
      return response.status(400).json({
        errors: exception.errors,
      });
    }

    return response.status(500).json({
      errors: (exception as Error).message,
    });
  }
}
