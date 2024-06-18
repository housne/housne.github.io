<script lang="ts">
import CommentForm from './Form.svelte'

export let slug: string
</script>

<div>
  <CommentForm slug={slug} />
</div>