import { z, type ZodType } from 'zod';

export class UserValidation {
  static readonly REGISTER: ZodType = z.object({
    username: z.string().min(1).max(32),
    password: z.string().min(1).max(50),
    name: z.string().min(1).max(16),
  });

  static readonly LOGIN: ZodType = z.object({
    username: z.string().min(1),
    password: z.string().min(1),
  });
}
