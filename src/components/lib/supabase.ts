// src/pages/api/waitlist.ts
import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

// Configuración segura (esto corre solo en el servidor)
const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_KEY; // Usa la ANON key aquí
const supabase = createClient(supabaseUrl, supabaseKey);
console.log(supabaseUrl, supabaseKey);
export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    const data = await request.json();
    const { email } = data;

    // Validación básica
    if (!email) {
      return new Response(JSON.stringify({ message: "Email requerido" }), { status: 400 });
    }
    const { error } = await supabase
      .from("waitlistvcoders") // Tu tabla
      .insert({ 
        email: email, 
        ip: clientAddress || request.headers.get("x-forwarded-for") || "unknown" 
      });

    if (error) {
      // Manejo de duplicados (Postgres error 23505)
      if (error.code === "23505") {
        return new Response(
          JSON.stringify({ message: "¡Ya estás en la lista! No te preocupes." }), 
          { status: 200 } // Retornamos 200 para no asustar al frontend, o 409 si prefieres
        );
      }
      throw error;
    }

    return new Response(
      JSON.stringify({ message: "¡Estás dentro!" }), 
      { status: 200 }
    );

  } catch (error) {
    console.error("Error servidor:", error);
    return new Response(
      JSON.stringify({ message: "Error interno. Intenta más tarde." }), 
      { status: 500 }
    );
  }
};