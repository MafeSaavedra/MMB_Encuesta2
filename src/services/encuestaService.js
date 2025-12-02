import { supabase } from "../supabaseClient";

export const enviarEncuesta = async ({
    usuario,
    sintomas,
    objetivos,
    nuevosObjetivos,
    mejoras,
    actividadRecuperada,
    comentario
}) => {

    // Armamos el payload limpio tal como lo espera la base de datos
    const payload = {
        cedula: usuario.cedula,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,

        // --- Sintomas y objetivos previos / nuevos ---
        sintoma1: sintomas[0] || null,
        obj1_original: objetivos[0] || null,
        obj1_nuevo: nuevosObjetivos[sintomas[0]] || null,
        mejora1: mejoras[sintomas[0]] || null,

        sintoma2: sintomas[1] || null,
        obj2_original: objetivos[1] || null,
        obj2_nuevo: nuevosObjetivos[sintomas[1]] || null,
        mejora2: mejoras[sintomas[1]] || null,

        sintoma3: sintomas[2] || null,
        obj3_original: objetivos[2] || null,
        obj3_nuevo: nuevosObjetivos[sintomas[2]] || null,
        mejora3: mejoras[sintomas[2]] || null,

        // --- Actividad recuperada (solo si aplica) ---
        actividad_recuperada: actividadRecuperada || null,

        // --- Comentario adicional ---
        comentario: comentario || null,
    };

    console.log("📤 Payload listo para supabase:", payload);

    const { error } = await supabase.from("encuesta2").insert(payload);

    if (error) {
        console.error("❌ Error al guardar encuesta:", error);
        throw error;
    }

    return { success: true };
};
