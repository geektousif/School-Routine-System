import { z } from 'zod';

import { UserRole } from '../utils/constants';

export const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Minimum 6 characters required'),
  role: z.nativeEnum(UserRole).optional(), // REVIEW think about default value here or entity && [REVIEW] optional could be nullish
});

export type CreateUserDto = z.infer<typeof createUserSchema>;

// TODO implement user response dto
