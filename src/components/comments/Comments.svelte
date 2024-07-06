<script lang="ts">
  import type { Comment } from '@/types/comment'
  import CommentForm from './Form.svelte'
  import CommentList from './List.svelte'

  export let slug: string
  export let comments: Comment[] = []
</script>

<div class="space-y-6">
  <CommentList {slug} {comments} />
  <CommentForm {slug} />
</div>