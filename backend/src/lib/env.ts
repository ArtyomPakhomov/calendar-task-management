/* eslint-disable node/no-process-env */
import fs from 'fs'
import path from 'path'
import * as dotenv from 'dotenv'
import { z } from 'zod'

const findEnvFilePath = (dir: string): string | null => {
  const maybeEnvFilePath = path.join(dir, '.env')
  if (fs.existsSync(maybeEnvFilePath)) {
    return maybeEnvFilePath
  }
  if (dir === '/') {
    return null
  }
  return findEnvFilePath(path.dirname(dir))
}

const envFilePath = findEnvFilePath(__dirname)
if (envFilePath) {
  dotenv.config({ path: envFilePath, override: true })
  dotenv.config({ path: `${envFilePath}.${process.env.NODE_ENV}`, override: true })
}

const zEnv = z.object({
  NODE_ENV: z.enum(['test', 'development', 'production']),
  PORT: z.string().trim().min(1),
  DATABASE_URL: z
    .string()
    .trim()
    .min(1)
    .refine((val) => {
      if (process.env.NODE_ENV !== 'test') {
        return true
      }
      const [databaseUrl] = val.split('?')
      const [databaseName] = databaseUrl.split('/').reverse()
      return databaseName.endsWith('-test')
    }, 'Data base name should ends with "-test" on test environment'),
  JWT_SECRET: z.string().trim().min(1),
  PASSWORD_SALT: z.string().trim().min(1),
  INITIAL_ADMIN_EMAIL: z.string().trim().min(1),
  INITIAL_ADMIN_PASSWORD: z.string().trim().min(1),
  WEBAPP_URL: z.string().trim().min(1),
  RUSENDER_API_KEY: z.string().trim().min(1),
  FROM_EMAIL_NAME: z.string().trim().min(1),
  FROM_EMAIL_ADDRESS: z.string().trim().min(1),
  HOST_ENV: z.enum(['local', 'production']),
  DEBUG: z
    .string()
    .optional()
    .refine(
      (val) => process.env.HOST_ENV === 'local' || process.env.NODE_ENV !== 'production' || (!!val && val.length > 0),
      'Required on not local host on production'
    ),
  BACKEND_SENTRY_DSN: z.string().trim().min(1),
  SOURCE_VERSION: z.string().trim().min(1),
})

export const env = zEnv.parse(process.env)
