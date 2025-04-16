import { z } from 'zod'

// const x: Array<string> = ['a', 'b']
// const y: ReadonlyArray<string> = ['a', 'b']
// console.info(x, y)
export const zEnv = z.object({
  VITE_BACKEND_TRPC_URL: z.string().trim().min(1),
})

// eslint-disable-next-line no-restricted-syntax
export const env = zEnv.parse(import.meta.env)
