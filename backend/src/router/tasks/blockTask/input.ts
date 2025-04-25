import { z } from 'zod'

export const zBlockTaskTrpcInput = z.object({
  taskId: z.string().min(1),
})
