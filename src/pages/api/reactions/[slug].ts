import type { APIRoute } from 'astro'
import { createDatabase } from '../../../helpers/database'
import { JsonResponse, BadRequestResponse } from '../../../helpers/response'
import { createReactionSchema } from '../../../zods/reactions'

export const prerender = false

export const GET: APIRoute = async ({ params, locals }) => {
  if (typeof params.slug !== 'string') {
    return new BadRequestResponse()
  }
  const { DB } = locals.runtime.env
  const database = createDatabase(DB)
  const reactions = await database.selectFrom('reactions')
    .where('post_slug', '=', params.slug)
    .selectAll()
    .execute()
  if (!reactions.length) {
    return new JsonResponse({})
  }
  return new JsonResponse(
    reactions.reduce<Record<number, number>>((list, current) => {
      const { type } = current
      if (!list[type]) {
        list[type] = 1
      } else {
        list[type] += 1
      }
      return list
    }, {})
  )
}

export const POST: APIRoute = async ({ params, locals, request }) => {
  if (typeof params.slug !== 'string') {
    return new BadRequestResponse()
  }
  const data = await request.json()
  const result = createReactionSchema.safeParse(data)
  if (!result.success) {
    return new BadRequestResponse()
  }
  const { DB } = locals.runtime.env
  const database = createDatabase(DB)
  await database.insertInto('reactions').values({...result.data, post_slug: params.slug }).execute()
  return new JsonResponse({message: 'success'})
}