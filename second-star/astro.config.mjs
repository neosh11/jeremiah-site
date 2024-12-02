// @ts-check
// @ts-check
import { defineConfig } from 'astro/config';

import solidJs from '@astrojs/solid-js';

import purgecss from 'astro-purgecss';

import playformCompress from '@playform/compress';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.jeremiahpinto.com',
  integrations: [solidJs(), purgecss(), playformCompress(), sitemap()]
});