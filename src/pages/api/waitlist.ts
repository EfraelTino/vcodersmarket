export const prerender = false;

import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = import.meta.env.SUPABASE_URL;

    const supabaseKey = import.meta.env.SUPABASE_ANON_KEY;
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes("@")) {
      return new Response(
        JSON.stringify({ message: "Email inválido" }), 
        { status: 400 }
      );
    }


    if (!supabaseKey) {
      return new Response(
        JSON.stringify({ message: "Error de configuración del servidor" }), 
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { error, status, statusText } = await supabase
      .from("waitlistvcoders") 
      .insert({ email: email });

    if (error) {

      if (status === 0 || status === 502) {
         return new Response(JSON.stringify({ message: "Error de conexión con el servidor Supabase." }), { status: 502 });
      }
      
      if (error.code === '23505') {
        return new Response(JSON.stringify({ message: "¡Ya estás registrado!" }), { status: 200 });
      }

      return new Response(JSON.stringify({ message: "Error al guardar tu correo." }), { status: 500 });
    }

    return new Response(
      JSON.stringify({ message: "¡Gracias por unirte a la lista de espera!" }), 
      { status: 200 }
    );

  } catch (err: any) {
    console.error("Error del servidor ", err);
    return new Response(
      JSON.stringify({ message: "Error inesperado del sistema." }), 
      { status: 500 }
    );
  }
};