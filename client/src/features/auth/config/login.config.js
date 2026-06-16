import { z } from 'zod';

export const loginFields = [
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'password', label: 'Password', type: 'password', required: true },
];

export const loginSchema = z.object({
  email: z
    .string()
    .nonempty('Email is required')
    .pipe(z.email('Please enter a valid Email')),

  password: z
    .string()
    .nonempty('Password is required')
    .min(6, { error: 'Password must be at least 6 characters long' }),
});
