import { z } from 'zod';

const registerSchema = z.object({
    email: z
        .string()
        .nonempty('Email is required')
        .pipe(z.email('Please enter a valid email')),

    displayName: z.string().optional(),

    username: z
        .string()
        .nonempty('Username is required')
        .min(3, { error: 'Username must be at least 3 characters long' })
        .max(30, { error: 'Username should be maximum of 30 characters' }),

    password: z
        .string()
        .nonempty('Password is required')
        .min(6, { error: 'Password must be at least 6 characters' }),

    dateOfBirth: z
        .string()
        .nonempty('Date of Birth is required')
        .pipe(z.coerce.date({ error: 'Please enter a valid date' })),

    agreeToTerms: z.literal(true, { error: 'You must agree to the terms' }),
});

export default registerSchema;
