<script lang="ts">
  import { type Comment } from '../../types/database'
  import CommentForm from './Form.svelte'
  import CommentList from './List.svelte'

  export let slug: string
  export let comments: Comment[] = []
</script>

<div>
  <CommentList {slug} {comments} />
  <CommentForm {slug} />
</div>