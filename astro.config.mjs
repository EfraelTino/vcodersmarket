// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import compress from 'astro-compress';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node'; // Mantén esto

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  site: 'https://vivemarket.com',

  // 1. ELIMINAMOS la línea "output: 'hybrid'" (Astro 5 ya no la quiere)
  
  // 2. MANTENEMOS el adaptador (Necesario para tu API)
  adapter: node({
    mode: 'standalone',
  }),

  image: {
    domains: ['supabase.easyautomates.com'],
  },
  
  build: {
    format: 'directory',
    inlineStylesheets: 'always',
  },
  
  integrations: [
    sitemap(),
    compress({
      HTML: {
        'html-minifier-terser': {
          removeComments: true,
        },
      },
      JavaScript: true,
      JSON: true,
      SVG: true,
      Logger: 1,
    }),
  ],
});