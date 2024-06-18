import type { D1Database } from '@cloudflare/workers-types'
import { Kysely } from 'kysely';
import { D1Dialect } from 'kysely-d1';
import type { Database } from '../types/database'

export const createDatabase = (database: D1Database) => {
  return new Kysely<Database>({ dialect: new D1Dialect({ database }) })
}