import { z } from 'zod';

const envSchema = z.object({
  VITE_API_URL: z.url({ error: 'Valid VITE_API_URL is required' }),
  MODE: z.enum(['production', 'development']),
});

const result = envSchema.safeParse(import.meta.env);

if (!result.success) {
  throw Error(
    `Environment validation error: ${result.error.issues.map(e => `${e.message}.`).join(' ')}`
  );
}

const envVars = result.data;

const config = {
  vite_api_url: envVars.VITE_API_URL,
  env: envVars.MODE,
};

export const isDev = config.env === 'development';

export default config;
