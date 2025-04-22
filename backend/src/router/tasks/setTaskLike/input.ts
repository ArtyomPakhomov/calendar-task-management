import { z } from 'zod'

export const zSetTaskLikeTrpcInput = z.object({
  taskId: z.string().uuid(),
  isLikedByMe: z.boolean(),
})
