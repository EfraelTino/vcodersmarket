export const prerender = false; // ✅ OBLIGATORIO: Le dice a Vercel que esto se ejecuta en el servidor

import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

export const POST: APIRoute = async ({ request }) => {
  try {
    const supabaseUrl = import.meta.env.SUPABASE_URL;
    const supabaseKey = import.meta.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ message: "Error de configuración del servidor (Faltan credenciales)" }), 
        { 
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

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
    
    const { error, status } = await supabase
      .from("waitlistvcoders") 
      .insert({ email: email });

    if (error) {
      if (error.code === '23505') {
        return new Response(
          JSON.stringify({ message: "¡Ya estás registrado en la lista!" }), 
          { 
            status: 200,
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
        headers: { "Content-Type": "application/json" } // ✅ Importante para que el frontend entienda la respuesta
      }
    );

  } catch (err: any) {
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