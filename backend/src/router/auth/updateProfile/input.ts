import { zInputRequired } from '@calendar-task-management/shared/src/zod'
import { z } from 'zod'

export const zUpdateProfileTrpcInput = z.object({
  name: zInputRequired,
  email: z.string().email('Invalid email address'),
})
