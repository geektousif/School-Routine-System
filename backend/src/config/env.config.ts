import 'dotenv/config';

import { cleanEnv, port, str } from 'envalid';

export const env = cleanEnv(process.env, {
  PORT: port({ default: 8000 }),
  NODE_ENV: str({
    default: 'development',
    choices: ['development', 'production'],
  }),

  POSTGRES_DB_NAME: str(),
  POSTGRES_DB_HOST: str(),
  POSTGRES_DB_PORT: port(),
  POSTGRES_DB_USER: str(),
  POSTGRES_DB_PASSWORD: str(),
});
