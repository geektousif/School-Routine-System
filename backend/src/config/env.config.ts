import 'dotenv/config';

import { cleanEnv, port, str } from 'envalid';

export const env = cleanEnv(process.env, {
  PORT: port({ default: 8000 }),
  NODE_ENV: str({
    default: 'development',
    choices: ['development', 'production'],
  }),
});
