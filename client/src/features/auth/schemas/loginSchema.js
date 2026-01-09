import { z } from 'zod';

const loginSchema = z.object({
  email: z
    .string()
    .nonempty('This field is required')
    .email('Valid email is required'),
  password: z
    .string()
    .nonempty('This field is required')
    .min(6, { error: 'Password must be at least 6 characters long' }),
});

export default loginSchema;
