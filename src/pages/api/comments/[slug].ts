import type { APIRoute } from 'astro'
import { createDatabase } from '../../../helpers/database'
import { JsonResponse, BadRequestResponse } from '../../../helpers/response'
import { createCommentSchema } from '../../../zods/comments'

export const prerender = false

export const GET: APIRoute = async ({ params, locals }) => {
  if (typeof params.slug !== 'string') {
    return new BadRequestResponse()
  }
  const { DB } = locals.runtime.env
  const database = createDatabase(DB)
  const comments = await database.selectFrom('comments')
    .where('post_slug', '=', params.slug)
    .selectAll()
    .execute()
  return new JsonResponse(comments)
}

export const POST: APIRoute = async ({ params, locals, request }) => {
  if (typeof params.slug !== 'string') {
    return new BadRequestResponse()
  }
  const data = await request.json()
  const result = createCommentSchema.safeParse(data)
  console.log(result)
  if (!result.success) {
    return new BadRequestResponse()
  }
  const { DB } = locals.runtime.env
  const database = createDatabase(DB)
  await database.insertInto('comments').values({...result.data, post_slug: params.slug }).execute()
  return new JsonResponse({message: 'success'})
}