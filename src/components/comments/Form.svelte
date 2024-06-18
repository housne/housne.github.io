<script lang="ts">
    import type { FormEventHandler } from 'svelte/elements';
import { createCommentSchema, type CreateCommentSchema } from '../../zods/comments'

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
    body
  }
  if (parent !== -1) {
    data.parent = parent
  }
  const res = await fetch(`/api/comments/${slug}`, {
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

<form on:submit={handleSubmit}>
  <input bind:value={author} required />
  <input bind:value={email} required />
  <input bind:value={website} />
  <textarea bind:value={body} required />
  <button>submit</button>
</form>

