<script lang="ts">
import { onMount, onDestroy } from 'svelte'
import { Theme } from '../types/theme'
import Sun from './icons/Sun.svelte'
import Moon from './icons/Moon.svelte'
import System from './icons/Device.svelte'

let theme = Theme.System

onMount(() => {
  theme = localStorage.getItem('theme') as Theme || Theme.System
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleSystemThemeChange)
})

const updateTheme = (theme: Theme.Dark | Theme.Light) => {
  if (theme === Theme.Dark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  window.dispatchEvent(new CustomEvent('theme-change', { detail: theme}))
}

const setTheme = (t: Theme) => {

  theme = t

  const setDarkTheme = () => {
    updateTheme(Theme.Dark)
    localStorage.setItem('theme', 'dark')
  }
  const setLightTheme = () => {
    updateTheme(Theme.Light)
    localStorage.setItem('theme', 'light')
  }

  switch (t) {
    case 'dark':
      setDarkTheme()
      break
    case 'light':
      setLightTheme()
      break
    case 'system':
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setDarkTheme()
      } else {
        setLightTheme()
      }
      localStorage.removeItem('theme')
      break
  }
}

const handleSystemThemeChange = (e: MediaQueryListEvent) => {
  if (theme === Theme.System) {
    updateTheme(e.matches ? Theme.Dark : Theme.Light)
  }
}

const ThemeList = [
  {
    name: Theme.System,
    icon: System,
  },
  {
    name: Theme.Light,
    icon: Sun,
  },
  {
    name: Theme.Dark,
    icon: Moon,
  }
]

</script>

<div role="radiogroup" class="flex items-center justify-between rounded-full bg-gray-100 p-[3px] space-x-[3px] dark:bg-gray-800">
    {#each ThemeList as item}
      <button
        class={`p-1.5 rounded-full hover:bg-white dark:hover:bg-gray-700 ${theme === item.name ? 'bg-white dark:bg-gray-700' : ''}`}
        on:click={() => setTheme(item.name)}
      >
        <svelte:component this={item.icon} />
      </button>
    {/each}
</div>