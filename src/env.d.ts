/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly PUBLIC_SUPABASE_URL: string;
  readonly PUBLIC_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Agrega esto para que Astro sepa qué es "user"
declare namespace App {
  interface Locals {
    user: import('@supabase/supabase-js').User | null;
  }
}