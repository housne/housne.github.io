export type Comment = {
  id: number
  parent?: number | null
  author: string
  avatar_url?: string
  body: string
  website?: string
}