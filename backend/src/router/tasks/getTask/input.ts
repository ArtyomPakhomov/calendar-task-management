import { z } from 'zod'
export const zGetTaskTrpcInput = z.object({
  id: z.string(),
})
