import 'dotenv-flow/config';
import type { Config } from 'drizzle-kit';

export default {
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
  schema: './lib/db/schema.ts',
  out: './migrations',
} satisfies Config;
