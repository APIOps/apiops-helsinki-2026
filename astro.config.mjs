// @ts-check
import { defineConfig } from 'astro/config';

import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  site: 'https://helsinki.apiops.info',
  adapter: netlify(),
  vite: {
    define: {
      'import.meta.env.PUBLIC_DEFAULT_OG_IMAGE': JSON.stringify('/images/hero/hero-bg.jpg'),
    },
  },
  image: {
                service: {
                        entrypoint: '@astrojs/netlify/image-service',
                },
        },
});
