// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import compress from 'astro-compress';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel'; // <--- CAMBIO IMPORTANTE

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  site: 'https://vivemarket.com', // Tu dominio (Vercel te dará uno temporal al principio)

  // Usamos el adaptador de Vercel (Serverless)
  adapter: vercel(),

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