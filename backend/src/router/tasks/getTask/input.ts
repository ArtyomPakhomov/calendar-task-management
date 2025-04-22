import { z } from 'zod'
export const zGetTaskTrpcInput = z.object({
  taskId: z.string(),
})
