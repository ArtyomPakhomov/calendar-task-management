import { z } from 'zod'

export const zCreateTaskTrpcInput = z.object({
  title: z
    .string()
    .min(1)
    .regex(/^[a-zA-Z0-9\s-]+$/, 'Title may contain only letters, numbers and dashes'),
  description: z.string().min(10, 'Description must be at least 10 characters long'),
})
