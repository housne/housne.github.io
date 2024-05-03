<script lang="ts">
import Fuse from 'fuse.js'
import { onMount, onDestroy, tick } from 'svelte'
import SearchIcon from './icons/Search.svelte'
import CloseIcon from './icons/Close.svelte'
import clsx from 'clsx'
import ThemeSwitcher from './ThemeSwitcher.svelte';

type Article = {
  id: string
  slug: string
  body: string
  data: {
    title: string
    description: string
    tag: string[]
  }
}

let index: Fuse<Article>
let searchQuery: string
let isOpen: boolean = false
let input: HTMLInputElement

let result: Article[] | undefined

async function search(query: string) {
  if (!index) {
    const res = await fetch('/articles.json')
    const articles = await res.json()
    index = new Fuse(articles, {
      keys: ['data.title', 'data.tags', 'body'],
      includeScore: true,
      includeMatches: true,
      threshold: 0.3
    })
  }
  const results = index.search(query)
  return results
}

function clear() {
  searchQuery = ''
  result = []
}

$: {
  if (searchQuery) {
    search(searchQuery).then((res) => {
      result = res.map((r) => r.item)
    })
  } else if (searchQuery === '') {
    result = undefined
  }
}

const handleOpen = () => {
  isOpen = !isOpen
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'auto'
  }
}

const open = () => {
  isOpen = true
  document.body.style.overflow = 'hidden'
}

const close = () => {
  isOpen = false
  document.body.style.overflow = 'auto'
}

const handleKeyboardBinding = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    open()
  }
  if (e.key === 'Escape') {
    close()
  }
}

onMount(() => {
  if (typeof window === 'undefined') return
  window.addEventListener('spotlight:open', open)
  window.addEventListener('spotlight:close', close)
})

onDestroy(() => {
  if (typeof window === 'undefined') return
  window.removeEventListener('spotlight:open', open)
  window.removeEventListener('spotlight:close', close)
})

onMount(() => {
  if (typeof window === 'undefined') return
  window.addEventListener('keydown', handleKeyboardBinding)
})

onDestroy(() => {
  if (typeof window === 'undefined') return
  window.removeEventListener('keydown', handleKeyboardBinding)
})

$: {
  if (isOpen) {
    tick().then(() => {
      input.focus()
    })
  }
}

const NAVS  = [
  {
    link: "/",
    label: "首页",
    icon: "🏠",
  },
  {
    link: "/about",
    label: "关于",
    icon: "💡",
  }
]

</script>

<div class={clsx('fixed top-0 left-0 w-screen h-screen z-20', isOpen ? '' : ' opacity-0 invisible')}>
  <div class="absolute top-0 left-0 w-screen h-screen bg-white/80 dark:bg-black/80 backdrop-blur-sm" on:click={handleOpen} aria-hidden="true">
  </div>
  <div class={clsx("relative z-10 max-w-screen-sm mx-auto mt-24 px-4 transition-[transform,opacity]", isOpen ? '' : 'scale-110 opacity-0')}>
    <div class="bg-white rounded-lg shadow-2xl dark:bg-gray-900 border dark:border-gray-800">
      <div class="relative flex items-center border-b dark:border-gray-800 px-2">
        <SearchIcon class="w-6 h-6 text-gray-500 dark:text-gray-200" />
        <input 
          class="bg-transparent py-2.5 px-2 block w-full outline-none appearance-none" 
          placeholder="搜索文章"
          id="search"
          bind:value={searchQuery}
          bind:this={input}
        />
        <div class="space-x-2 flex">
        {#if searchQuery}<button class="flex items-center justify-center border rounded-full opacity-50 hover:opacity-100 w-5 h-5" on:click={clear}><CloseIcon class="w-4 h-4" /></button>{/if}
        <button class="border rounded-md py-0.5 px-1 text-xs text-gray-500 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800" on:click={close}>Esc</button>
        </div>
      </div>
      <div>
        {#if !result}
          <div></div>
        {:else if result?.length === 0}
          <div class="text-gray-500 p-3 text-sm">暂无搜索结果</div>
        {:else if result?.length > 0}
        <div class="pt-2">
          <span class="text-xs text-gray-500 mb-2 block px-3">文章</span>
          <div class="px-1.5">
            {#each result as article (article.id)}
              <a href={`/articles/${article.slug}`} class="py-2 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-sm flex items-center">{article.data.title}</a>
            {/each}
          </div>
        </div>
        {/if}
        <div class="py-2">
          <span class="text-xs text-gray-500 mb-2 block px-3">页面</span>
          <div class="px-1.5">
            {#each NAVS as nav }
              <a href={nav.link} class="py-2 px-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-sm flex items-center justify-between">
                {nav.label}
                <span class="text-gray-500 text-xs">页面</span>
              </a>
            {/each}
          </div>
        </div>
      </div>
      <div class="flex p-2 border-t dark:border-gray-800 justify-end">
        <ThemeSwitcher />
      </div>
    </div>
  </div>
</div>