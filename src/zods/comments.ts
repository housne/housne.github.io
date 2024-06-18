import { z } from 'zod'

export const createCommentSchema = z.object({
  author: z.string(),
  email: z.string().email(),
  website: z.string().url().optional(),
  body: z.string(),
  parent: z.number().optional()
})

export type CreateCommentSchema = z.infer<typeof createCommentSchema>