import { z } from 'zod';

const registerSchema = z.object({
  email: z
    .string()
    .nonempty({ message: 'This field is required' })
    .email({ message: 'Invalid email address' }),
  displayName: z.string(),
  username: z.string().nonempty({ message: 'This field is required' }),
  password: z
    .string()
    .nonempty({ message: 'This field is required' })
    .min(6, { message: 'Must be at least 6 characters long' }),
  dob: z.string().nonempty({ message: 'This field is required' }),
  agreeToTerms: z.literal(true, {
    error: 'You must agree to the terms and conditions',
  }),
});

export default registerSchema;
