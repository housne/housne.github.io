import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";
import svelte from "@astrojs/svelte";
import expressiveCode from "astro-expressive-code";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: 'https://housne.github.io',
  integrations: [sitemap(), tailwind(), svelte(), expressiveCode({
    theme: 'one-dark-pro'
  }), mdx()],
  prefetch: {
    prefetchAll: true
  },
  output: "hybrid",
  adapter: cloudflare({
    platformProxy: {
      enabled: true
    }
  })
});