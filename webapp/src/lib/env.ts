import { z } from 'zod'

// const x: Array<string> = ['a', 'b']
// const y: ReadonlyArray<string> = ['a', 'b']
// console.info(x, y)
export const zEnv = z.object({
  NODE_ENV: z.enum(['development', 'production']),
  VITE_BACKEND_TRPC_URL: z.string().trim().min(1),
  VITE_WEBAPP_URL: z.string().trim().min(1),
})

// eslint-disable-next-line node/no-process-env
export const env = zEnv.parse(process.env)
