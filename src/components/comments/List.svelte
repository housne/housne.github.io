<script lang="ts">
  import {  onMount } from 'svelte'
  import { type Comment } from '@/types/comment'

  export let slug: string;
  export let comments: Comment[] = [];

  onMount(async () => {
    const res = await fetch(`https://workers.yihao.dev/comments?slug=${slug}`)
    const data = await res.json()
    comments = data
  });
  
</script>

<ul class="space-y-6">
  {#each comments as comment}
    <div class="flex space-x-4">
      <img class="rounded-fulll w-12 h-12" />
      <div class="flex-1">
        <div>
          <span>{ comment.author }</span>
        </div>
        <div>{ comment.body }</div>
      </div>
    </div>
  {/each}
</ul>