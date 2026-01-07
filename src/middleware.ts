import { createServerClient, parseCookieHeader } from "@supabase/ssr";
import { defineMiddleware } from "astro/middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const supabase = createServerClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(context.request.headers.get("Cookie") ?? "");
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            context.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // 1. Verificamos el usuario
  const { data: { user } } = await supabase.auth.getUser();

  // 2. Lo guardamos en locals para usarlo en el Layout
  context.locals.user = user;

  // 3. LÓGICA DE PROTECCIÓN (Aquí está la solución)
  // Si la URL empieza con /app/dashboard Y no hay usuario...
  if (context.url.pathname.startsWith("/app/dashboard") && !user) {
    // ...redirigimos ANTES de renderizar nada.
    return context.redirect("/app"); // O la ruta de tu login, ej: "/app"
  }

  return next();
});