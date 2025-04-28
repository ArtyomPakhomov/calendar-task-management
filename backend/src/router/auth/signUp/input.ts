import { zInputRequired } from '@calendar-task-management/shared/src/zod'
import { z } from 'zod'

export const zSignUpTrpcInput = z.object({
  name: zInputRequired,
  email: z.string().email('Invalid email address'),
  password: z.string().min(3, 'Password must be at least 3 characters long'),
})
