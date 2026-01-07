import { type APIRoute } from "astro";
import { createServerClient, parseCookieHeader } from "@supabase/ssr";

export const POST: APIRoute = async ({ request, cookies }) => {
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

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "http://localhost:4321/api/auth/callback",
    },
  });

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  // --- CAMBIO IMPORTANTE ---
  // En lugar de redirigir (redirect), devolvemos la URL en un JSON
  // para que el cliente haga la navegación manual.
  return new Response(JSON.stringify({ url: data.url }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};