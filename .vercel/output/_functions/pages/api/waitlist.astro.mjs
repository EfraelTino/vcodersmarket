import { createClient } from '@supabase/supabase-js';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const POST = async ({ request }) => {
  try {
    const supabaseUrl = "https://supabase.easyautomates.com";
    const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAic3VwYWJhc2UiLAogICJpYXQiOiAxNzE1MDUwODAwLAogICJleHAiOiAxODcyODE3MjAwCn0.ENz30nfAuev7ARbzhYdVPUMlIhYhUf7fCpeIb3zNtQw";
    if (!supabaseUrl || !supabaseKey) ;
    const body = await request.json();
    const { email } = body;
    if (!email || !email.includes("@")) {
      return new Response(
        JSON.stringify({ message: "Email inválido" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { error, status } = await supabase.from("waitlistvcoders").insert({ email });
    if (error) {
      if (error.code === "23505") {
        return new Response(
          JSON.stringify({ message: "¡Ya estás registrado en la lista!" }),
          {
            status: 200,
            // Devolvemos 200 para que el frontend muestre el mensaje verde
            headers: { "Content-Type": "application/json" }
          }
        );
      }
      return new Response(
        JSON.stringify({ message: "Error al guardar tu correo. Intenta más tarde." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    return new Response(
      JSON.stringify({ message: "¡Gracias por unirte a la lista de espera!" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
        // ✅ Importante para que el frontend entienda la respuesta
      }
    );
  } catch (err) {
    console.error("Error del servidor: ", err);
    return new Response(
      JSON.stringify({ message: "Error inesperado del sistema." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
