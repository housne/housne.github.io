<script lang="ts">
import type { FormEventHandler } from 'svelte/elements';
import { createCommentSchema, type CreateCommentSchema } from '../../zods/comments'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export let parent: number = -1
export let slug: string

let author: string
let email: string
let website: string
let body: string

const createComments = async () => {
  const data: CreateCommentSchema = {
    author,
    email,
    website,
    body,
    post_slug: slug
  }
  if (parent !== -1) {
    data.parent = parent
  }
  const res = await fetch(`https://workers.yihao.dev/comments`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'content-type': 'application/json'
    }
  })
}

const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
  e.preventDefault()
  await createComments()
}

</script>

<form on:submit={handleSubmit} class="space-y-4">
  <div class="space-y-1.5">
    <Label for="author">名称</Label>
    <Input bind:value={author} id="author" required />
  </div>
  <div class="space-y-1.5">
    <Label for="email">邮箱</Label>
    <Input bind:value={email} id="email" required />
  </div>
  <div class="space-y-1.5">
    <Label for="website">网址</Label>
    <Input id="website" bind:value={website} />
  </div>
  <div class="space-y-1.5">
    <Label for="body">评论内容</Label>
    <Textarea id="body" bind:value={body} required rows={5} />
  </div>
  <Button type="submit">提交</Button>
</form>

