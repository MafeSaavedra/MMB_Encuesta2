import { useLocation, useNavigate } from "react-router-dom";
import "./Encuesta.css";
import opcionesPorSintoma from "../constants/opcionesPorSintoma";
import CustomSelect from "../components/CustomSelect";
import CustomButton from "../components/Button";
import { enviarEncuesta } from "../services/encuestaService";
import useNotification from "../hooks/useNotification";
import { validarEncuesta } from "../services/validationService";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient.js";

export default function Encuesta() {
    const location = useLocation();
    const usuario = location.state?.usuario;
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [nuevosObjetivos, setNuevosObjetivos] = useState({});
    const [mejoras, setMejoras] = useState({});
    const [actividadRecuperada, setActividadRecuperada] = useState("");
    const { showNotification, NotificationContainer } = useNotification();
    const invalores = ["nan", "no diste información", "no aplica"];
    const [comentario, setComentario] = useState("");

    const showActividad =
        data?.actividad_pasada &&
        data?.impedimento &&
        data?.ultima_vez &&
        !invalores.includes(data.actividad_pasada.toLowerCase()) &&
        !invalores.includes(data.impedimento.toLowerCase()) &&
        !invalores.includes(data.ultima_vez.toLowerCase());

    useEffect(() => {
        const fetchData = async () => {
            if (!usuario?.cedula) return;

            const { data, error } = await supabase
                .from("encuestas")
                .select(
                    `
          limitacion,
          actividades,
          sintomas,
          objetivos,
          actividad_pasada,
          ultima_vez,
          impedimento,
          nombre,
          apellido
        `
                )
                .eq("cedula", usuario.cedula)
                .single();

            if (error) {
                console.error(error);
            } else {
                setData(data);
            }
        };

        fetchData();
    }, [usuario]);

    if (!data) return <p>Cargando datos...</p>;

    // Función para normalizar y encontrar la clave correcta
    const getSintomaKey = (sintoma) => {
        // Buscar una clave que comience con el síntoma, ignorando espacios al inicio y final
        const key = Object.keys(opcionesPorSintoma).find((k) =>
            k.trim().startsWith(sintoma.trim())
        );
        // Si no se encuentra una clave que comience con el síntoma,
        // se busca una que lo contenga completamente
        if (!key) {
            return Object.keys(opcionesPorSintoma).find((k) =>
                k.trim().includes(sintoma.trim())
            );
        }
        return key;
    };

    // Procesar listas
    const sintomas = data.sintomas
        ? data.sintomas
            .split(/(?<!Tengo )(?=[A-ZÁÉÍÓÚÑ])/) // Nueva expresión regular aquí
            .map((s) => s.trim())
            .filter((s) => s && s.toLowerCase() !== "nan")
        : [];

    const objetivos = data.objetivos
        ? data.objetivos
            .split(/[,;]+/)
            .map((o) => o.trim())
            .filter((o) => o && o.toLowerCase() !== "nan")
        : [];

    const handleNuevoObjetivo = (sintoma, valor) => {
        setNuevosObjetivos((prev) => ({
            ...prev,
            [sintoma]: valor,
        }));
    };
    const handleSubmit = async () => {
        // Validar campos faltantes

        try {
          const result = await enviarEncuesta({
        usuario,
        sintomas,
        objetivos,
        nuevosObjetivos,
        mejoras,
        actividadRecuperada,
        comentario, // 👉 Se agrega aquí
        });

            if (result.success) {
                showNotification("✅ Encuesta enviada correctamente", "success", 2000);
                setTimeout(() => {
                    navigate("/", { state: { usuario } });
                }, 3000);
            } else if (result.alreadyExists) {
                showNotification(
                    "♦️ Ya habías completado esta encuesta, te enviaremos al inicio",
                    "success",
                    2000
                );
                setTimeout(() => {
                    navigate("/", { state: { usuario } });
                }, 3000);
            }
        } catch (error) {
            console.error("Error al enviar la encuesta:", error);
            showNotification(`❌ ${error.message}`, "error", 5000);
        }
    };

    return (
        <div className="Contenedor-General">
            <h2 className="TituloGenerico">ENCUESTA DE LOGROS</h2>
            <p className="TextoGenericoimport">
                <strong>Cédula:</strong> <span className="NumeroCedula">{usuario?.cedula || "No registrada"}</span>
            </p>


            <p className="TextoGenerico">
                Sobre tu vida y la movilidad, mencionaste que tu vida se encuentra{" "}
                <strong className="strong-1">{data.limitacion}</strong> limitada
            </p>

            <p className="TextoGenerico">
                En cuanto a lo que estabas sintiendo en este momento, compartiste que
                las actividades más importantes para ti eran:
            </p>

            <ul className="Lista">
                {data.actividades &&
                    data.actividades.split("-").map((act, idx) => <li key={idx}>{act.trim()}</li>)}
            </ul>

            <h2 className="TituloGenerico">PROBLEMAS Y OBJETIVOS </h2>

            {sintomas.slice(0, 3).map((sintoma, idx) => {
                // Lógica de búsqueda mejorada
                const sintomaNormalizado = sintoma.trim().toLowerCase();
                const keyCorrecta = Object.keys(opcionesPorSintoma).find(key =>
                    key.trim().toLowerCase().includes(sintomaNormalizado)
                );

                if (!keyCorrecta) {
                    console.warn(`No se encontró una clave exacta para el síntoma: "${sintoma}"`);
                }

                return (
                    <div key={idx}>
                        <p className="TextoGenerico">La última vez mencionaste como</p>
                        <p className="Problema">
                            Problema {idx + 1}:{" "}
                            <strong className="strong-1">{sintoma}</strong> <br />
                            🏅 Tu objetivo era:{" "}
                            <strong className="strong-1">
                                {objetivos[idx] ? objetivos[idx] : "No registrado"}
                            </strong>
                        </p>

                        <p className="TextoGenerico">
                            - Desde tu percepción, ¿cuánto has mejorado respecto a este
                            objetivo?
                        </p>
                        <CustomSelect
                            label="¿Cuánto has mejorado respecto a este objetivo?"
                            value={mejoras[sintoma] || ""}
                            onChange={(e) =>
                                setMejoras((prev) => ({
                                    ...prev,
                                    [sintoma]: e.target.value,
                                }))
                            }
                            options={["Nada", "Poco", "Moderadamente", "Bastante", "Mucho"]}
                        />

                        <p className="TextoGenerico">
                            - ¿Quieres plantear un nuevo objetivo relacionado con este
                            problema?
                        </p>
                        {keyCorrecta ? (
                            <CustomSelect
                                label="Selecciona un nuevo objetivo:"
                                value={nuevosObjetivos[sintoma] || ""}
                                onChange={(e) => handleNuevoObjetivo(sintoma, e.target.value)}
                                options={opcionesPorSintoma[keyCorrecta]}
                            />
                        ) : (
                            <p>(No hay opciones definidas para este síntoma)</p>
                        )}

                        <p className="Recordatorio">
                            Ten presente que si no obtuviste avances, deberías mantener el
                            mismo objetivo inicial.
                        </p>

                        <hr className="separador" />
                    </div>
                );
            })}
            {showActividad && (
                <>
                    <h2 className="TituloGenerico">ACTIVIDAD QUE YA NO REALIZAS </h2>

                    <p className="TextoGenerico">
                        También nos contaste que antes podías{" "}
                        <strong className="strong-1">{data.actividad_pasada}</strong>, pero
                        actualmente no lo logras debido a{" "}
                        <strong className="strong-1">{data.impedimento}</strong>.
                    </p>

                    <p className="TextoGenerico">
                        La última vez que lo realizaste fue{" "}
                        <strong>{data.ultima_vez}</strong>.
                    </p>

                    <p className="TextoGenerico">
                        Mencionaste que dejaste de
                        <strong className="strong-1"> {data.actividad_pasada}</strong>, ¿La
                        has retomado actualmente?
                    </p>

                    <CustomSelect
                        label="Selecciona una opción:"
                        value={actividadRecuperada}
                        onChange={(e) => setActividadRecuperada(e.target.value)}
                        options={["Sí", "No"]}
                    />
                </>
            )}
            <br></br>
            <hr className="separador" />
            <h2 className="TituloGenerico">
                CUÉNTANOS CÓMO TE HAS SENTIDO CON TU PROGRESO
            </h2>
            <textarea
                className="ComentarioBox"
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                maxLength={120}
                placeholder="Escribe un comentario adicional (máx. 120 caracteres)"
            />
            <p className="TextoGenerico">{comentario.length}/120 caracteres</p>

            <p className="Recordatorio">
                Antes de enviar el formulario, verifique que todas las opciones fueron
                seleccionadas
            </p>

            <CustomButton label="Enviar Nueva Encuesta" onClick={handleSubmit} />
            <NotificationContainer />
        </div>
    );
}