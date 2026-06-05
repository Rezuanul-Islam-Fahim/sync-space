import { z } from 'zod';

const loginSchema = z.object({
  email: z
    .string()
    .nonempty('Email is required')
    .pipe(z.email('Please enter a valid Email')),

  password: z
    .string()
    .nonempty('Password is required')
    .min(6, { error: 'Password must be at least 6 characters long' }),
});

export default loginSchema;
