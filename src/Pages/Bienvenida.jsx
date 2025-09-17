import { useState } from "react";
import Gif from "../Img/Gif.gif";
import { useNavigate } from "react-router-dom";
import "./Bienvenida.css";
import { supabase } from "../supabaseClient";

export default function Bienvenida() {
    const navigate = useNavigate();
    const [cedula, setCedula] = useState("");
    const verificarCedula = async () => {
        if (!cedula) {
            alert("Por favor, ingrese una cédula");
            return;
        }

        // Convertir a número
        const cedulaNumero = parseInt(cedula, 10);

        const { data, error } = await supabase
            .from("encuestas")
            .select("*")
            .eq("cedula", cedulaNumero);

        console.log("Cedula buscada:", cedulaNumero, typeof cedulaNumero);
        console.log("🔍 Resultado Supabase:", data, error);

        if (error) {
            console.error("❌ Error en la consulta:", error);
            alert("Hubo un problema con la búsqueda");
            return;
        }

        if (!data || data.length === 0) {
            alert("⚠️ Usuario no encontrado en la base de datos");
            return;
        }

        const usuario = data[0]; // 👈 tomar el primer registro

        // 👀 Mostrar alerta de verificación
        alert(`✅ Bienvenido ${usuario.nombre} ${usuario.apellido}`);

        // 🚀 Redirigir a la página Inicio y pasar usuario
        navigate("/Inicio", { state: { usuario } });

    };

    return (
        <div className="BloqueGeneral">
            <div className="bienvenida-card">
                <h1 className="bienvenida-title">
                    Bienvenid@ al Programa <span className="text-green">MMB</span>
                </h1>
                <input
                    className="cedula-input"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={cedula}
                    onChange={(e) => {
                        const soloNumeros = e.target.value.replace(/[^0-9]/g, "");
                        setCedula(soloNumeros);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            verificarCedula();
                        }
                    }}
                />

                <p className="cedula-help">Ingrese su Número de Cédula</p>
            </div>

            <div className="Imagen-gif">
                <img src={Gif} className="gif" alt="Gif animado" />
            </div>

        </div>
    );
}
