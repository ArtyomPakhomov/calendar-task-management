import { z } from 'zod'

export const zUpdatePasswordTrpcInput = z.object({
  oldPassword: z.string().min(3, 'Password must be at least 3 characters long'),
  newPassword: z.string().min(3),
})
