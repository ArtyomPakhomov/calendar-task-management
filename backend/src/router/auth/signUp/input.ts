import { z } from 'zod'

export const zSignUpTrpcInput = z.object({
  name: z
    .string()
    .min(3)
    .regex(/^[а-яА-ЯёЁ\s]+$/, 'Name must be only letters and spaces'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(3, 'Password must be at least 3 characters long'),
})
