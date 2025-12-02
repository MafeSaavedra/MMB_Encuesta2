// services/validationService.js

export function validarEncuesta({ sintomas, nuevosObjetivos, mejoras, actividadRecuperada, data }) {
    const faltantes = [];

    // 🔹 Validar percepción de mejora por síntoma
    sintomas.forEach((s) => {
        if (!mejoras[s]) {
            faltantes.push(`Percepción de mejora para el problema: ${s}`);
        }
    });

    // 🔹 Validar objetivos nuevos por síntoma
    sintomas.forEach((s) => {
        if (!nuevosObjetivos[s]) {
            faltantes.push(`Nuevo objetivo para el problema: ${s}`);
        }
    });

    // 🔹 Validar actividad pasada (solo si aplica)
    if (
        data.actividad_pasada &&
        data.actividad_pasada.toLowerCase() !== "nan" &&
        data.actividad_pasada.toLowerCase() !== "no diste información"
    ) {
        if (!actividadRecuperada) {
            faltantes.push(`Si retomaste la actividad: ${data.actividad_pasada}`);
        }
    }

    return faltantes;
}
