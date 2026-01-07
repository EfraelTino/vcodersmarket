import type { APIRoute } from "astro";
import { createServerClient, parseCookieHeader } from "@supabase/ssr";

// 1. Cambiamos GET por POST para coincidir con el formulario del Layout
export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  
  // 2. Inicializamos Supabase (Igual que en el Middleware)
  const supabase = createServerClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get("Cookie") ?? "");
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // 3. Usamos el método oficial de Supabase
  // Esto borra las cookies Y mata la sesión en el servidor.
  await supabase.auth.signOut();

  // 4. Redirigimos al Login
  return redirect("/");
};