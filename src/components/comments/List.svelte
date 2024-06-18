<script lang="ts">
  import {  onMount } from 'svelte'
  import { type Comment } from '../../types/database'

  export let slug: string;
  export let comments: Comment[] = [];

  onMount(async () => {
    const res = await fetch(`/api/comments/${slug}`)
    const data = await res.json()
    comments = data
  });
  
</script>

<ul>
  {#each comments as comment}
    <li>{comment.body}</li>
  {/each}
</ul>