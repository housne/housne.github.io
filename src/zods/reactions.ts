import { z } from 'zod'

export const createReactionSchema = z.object({
  type: z.number()
})