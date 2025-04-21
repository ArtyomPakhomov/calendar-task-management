import { z } from 'zod'

export const zUpdateProfileTrpcInput = z.object({
  name: z
    .string()
    .min(3)
    .regex(/^[а-яА-ЯёЁ\s]+$/, 'Name must be only letters and spaces'),
  email: z.string().email('Invalid email address'),
})
