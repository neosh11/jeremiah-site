// @ts-check
// @ts-check
import { defineConfig } from 'astro/config';

import solidJs from '@astrojs/solid-js';

import purgecss from 'astro-purgecss';

// https://astro.build/config
export default defineConfig({
  integrations: [solidJs(), purgecss()]
});