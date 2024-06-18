import type {Generated } from 'kysely'

export interface Database {
  comments: CommentTable
  reactions: ReactionTable
}

export interface CommentTable {
  id: Generated<number>
  author: string
  email: string
  website: string | null
  body: string
  post_slug: string
  parent: number | null
}

export interface ReactionTable {
  id: Generated<number>
  post_slug: string
  type: number
}