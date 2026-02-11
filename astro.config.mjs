// @ts-check
import { defineConfig } from 'astro/config';

import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  site: 'https://helsinki.apiops.info',
  adapter: netlify(),
  image: {
                service: {
                        entrypoint: '@astrojs/netlify/image-service',
                },
        },
});