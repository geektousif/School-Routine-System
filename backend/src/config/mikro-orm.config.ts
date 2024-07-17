import { Migrator } from '@mikro-orm/migrations';
import { defineConfig } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

import { env } from './env.config';

export default defineConfig({
  dbName: env.POSTGRES_DB_NAME,
  user: env.POSTGRES_DB_USER,
  password: env.POSTGRES_DB_PASSWORD,
  host: env.POSTGRES_DB_HOST,
  port: env.POSTGRES_DB_PORT,
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  metadataProvider: TsMorphMetadataProvider,
  debug: true,
  extensions: [Migrator],
});
