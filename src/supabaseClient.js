// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// 🚨 Validación: Si falta alguna variable, lanza error en consola
if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
        "❌ ERROR: No se encontraron las variables de entorno VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY.\n" +
        "👉 Verifica que tu archivo .env.local contenga:\n" +
        "VITE_SUPABASE_URL=https://TU_PROYECTO.supabase.co\n" +
        "VITE_SUPABASE_ANON_KEY=TU_ANON_KEY\n"
    );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
