import { useLocation } from "react-router-dom";
import "./Encuesta.css";
import opcionesPorSintoma from "../constants/opcionesPorSintoma";
import CustomSelect from "../components/CustomSelect";
import CustomButton from "../components/Button";
import { enviarEncuesta } from "../services/encuestaService";


import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient.js";

export default function Encuesta() {
    const location = useLocation();
    const usuario = location.state?.usuario;
    const [data, setData] = useState(null);
    const [nuevosObjetivos, setNuevosObjetivos] = useState({});


    useEffect(() => {
        const fetchData = async () => {
            if (!usuario?.cedula) return;

            const { data, error } = await supabase
                .from("encuestas")
                .select(
                    "limitacion, actividades, sintomas, objetivos, actividad_pasada, ultima_vez, impedimento"
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

    // Procesar listas
    const sintomas = data.sintomas
        ? data.sintomas
            .split(/(?=[A-ZÁÉÍÓÚÑ])/g) // divide antes de una mayúscula
            .map((s) => s.trim())
            .filter((s) => s && s.toLowerCase() !== "nan")
        : [];

    const objetivos = data.objetivos
        ? data.objetivos
            .split(/[,;]+/) // separa por coma o punto y coma
            .map((o) => o.trim())
            .filter((o) => o && o.toLowerCase() !== "nan")
        : [];

    const handleNuevoObjetivo = (sintoma, valor) => {
        setNuevosObjetivos((prev) => ({
            ...prev,
            [sintoma]: valor,
        }));
    };

    // 👉 Aquí usas la función externa
    const handleSubmit = async () => {
        try {
            await enviarEncuesta({ usuario, sintomas, objetivos, nuevosObjetivos });
            alert("Encuesta enviada correctamente ✅");
        } catch (error) {
            alert("Hubo un problema al guardar la encuesta ❌");
        }
    };


    return (
        <div className="Contenedor-General" >
            <h2>ENCUESTA DE LOGROS</h2>

            <p className="strong-1">
                Sobre tu vida y la movilidad, mencionaste que tu vida se encuentra{" "}
                <strong>{data.limitacion}</strong> limitada
            </p>

            <p className="strong-1">
                En cuanto a lo que estás sintiendo en este momento, compartiste que lo
                más importante para ti era:
            </p>

            <ul className="Lista">
                {data.actividades &&
                    data.actividades
                        .split("-")
                        .map((act, idx) => (
                            <li key={idx}>{act.trim()}</li>
                        ))}
            </ul>

            <h2>PROBLEMAS Y OBJETIVOS </h2>

            {[...sintomas.slice(0, 3)].map((sintoma, idx) => (
                <div key={idx} >
                    <p className="Problema">
                        Problema {idx + 1} : <strong className="strong-1">{sintoma}</strong> <br />
                        🏅 Tu objetivo era :{" "}
                        <strong className="strong-1">{objetivos[idx] ? objetivos[idx] : "No registrado"}</strong>
                    </p>

                    {/* Lista desplegable para seleccionar nuevo objetivo */}  {/* objetivo 2*/}
                    {opcionesPorSintoma[sintoma] ? (
                        <CustomSelect
                            label="Selecciona un nuevo objetivo:"
                            value={nuevosObjetivos[sintoma] || ""}
                            onChange={(e) => handleNuevoObjetivo(sintoma, e.target.value)}
                            options={opcionesPorSintoma[sintoma]}
                        />
                    ) : (
                        <p>
                            (No hay opciones definidas para este síntoma)
                        </p>
                    )}

                </div>
            ))}

            <h2>ACTIVIDAD QUE YA NO REALIZAS </h2>

            <p className="strong-1">
                También nos contaste que antes podías{" "}
                <strong>
                    {data.actividad_pasada && data.actividad_pasada.toLowerCase() !== "nan"
                        ? data.actividad_pasada
                        : "No diste información"}
                </strong>
                , pero actualmente no lo logras debido a{" "}
                <strong>
                    {data.impedimento && data.impedimento.toLowerCase() !== "nan"
                        ? data.impedimento
                        : "No diste información"}
                </strong>.
            </p>

            <p className="strong-1">
                La última vez que lo realizaste fue{" "}
                <strong>
                    {data.ultima_vez && data.ultima_vez.toLowerCase() !== "nan"
                        ? data.ultima_vez
                        : "No diste información"}
                </strong>.
            </p>
            <CustomButton label="Enviar Nueva Encuesta" onClick={handleSubmit} />

        </div>
    );
}
