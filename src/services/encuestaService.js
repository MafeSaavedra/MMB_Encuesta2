import { supabase } from "../supabaseClient";

// Esta función recibe todo lo que necesita desde el componente
export const enviarEncuesta = async ({ usuario, sintomas, objetivos, nuevosObjetivos }) => {
    // Construimos el objeto a insertar
    const payload = {
        cedula: usuario.cedula,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        sintoma1: sintomas[0] || null,
        obj1_original: objetivos[0] || null,
        obj1_nuevo: nuevosObjetivos[sintomas[0]] || null,
        sintoma2: sintomas[1] || null,
        obj2_original: objetivos[1] || null,
        obj2_nuevo: nuevosObjetivos[sintomas[1]] || null,
        sintoma3: sintomas[2] || null,
        obj3_original: objetivos[2] || null,
        obj3_nuevo: nuevosObjetivos[sintomas[2]] || null,
    };

    console.log("Payload listo para enviar:", payload);

    const { error } = await supabase.from("encuesta2").insert(payload);

    if (error) {
        console.error("Error al guardar:", error);
        throw error; // lo lanzamos para manejarlo en el componente
    }

    return true;
};
