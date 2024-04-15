import { Injectable } from '@nestjs/common';
import type { ZodType } from 'zod';

@Injectable()
export class ValidationService {
  validate<Type>(zodType: ZodType<Type>, data: Type): Type {
    return zodType.parse(data);
  }
}
