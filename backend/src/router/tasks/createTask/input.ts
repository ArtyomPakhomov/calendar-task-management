import { zInputRequired } from '@calendar-task-management/shared/src/zod'
import { z } from 'zod'

export const zCreateTaskTrpcInput = z.object({
  title: zInputRequired,
  description: z.string().min(10, 'Description must be at least 10 characters long'),
})
