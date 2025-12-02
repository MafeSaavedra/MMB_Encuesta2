import { useState } from "react";
import Gif from "../Img/Gif.gif";
import { useNavigate } from "react-router-dom";
import "./Bienvenida.css";
import { supabase } from "../supabaseClient";
import useNotification from "../hooks/useNotification";
import "./BienvenidaResponsive.css";
import CustomButton from "../components/Button";

export default function Bienvenida() {
    const navigate = useNavigate();
    const [cedula, setCedula] = useState("");
    const { showNotification, NotificationContainer } = useNotification();

    const verificarCedula = async () => {
        if (!cedula) {
            showNotification("⚠️ Por favor, ingrese una cédula", "warning", 3000);
            return;
        }

        try {
            console.log("🔎 Verificando cédula:", cedula);

            // 🧪 BLOQUE DE PRUEBA DE ROL Y POLÍTICA (puedes quitarlo después)
            const { data: test, error: testError } = await supabase
                .from("encuesta2")
                .select("*")
                .limit(1);

            console.log("🔐 Test acceso encuesta2 (rol anon):", { test, testError });

            if (testError) {
                console.warn("⚠️ El rol anon no tiene permiso para leer encuesta2:", testError.message);
            } else {
                console.log("✅ Rol anon puede leer encuesta2:", test);
            }

            // 🔍 1️⃣ Buscar si hizo la encuesta 1
            const { data: data1, error: error1 } = await supabase
                .from("encuestas")
                .select("cedula, nombre, apellido")
                .eq("cedula", cedula.toString())
                .maybeSingle();

            if (error1 && error1.code !== "PGRST116") throw error1;
            console.log("📋 Resultado encuestas:", data1);

            // 🔍 2️⃣ Buscar si hizo la encuesta 2 (solo leyendo cédula)
            const { data: data2, error: error2 } = await supabase
                .from("encuesta2")
                .select("cedula")
                .eq("cedula", cedula.toString())
                .maybeSingle();

            if (error2 && error2.code !== "PGRST116") throw error2;
            console.log("📋 Resultado encuesta2:", data2);

            // ✅ Caso 1: Ya completó ambas
            if (data1 && data2) {
                showNotification("✅ El usuario ya realizó las dos encuestas de logros", "info", 4000);
                return;
            }

            // ⚠️ Caso 2: Ya hizo la segunda (no debe pasar)
            if (!data1 && data2) {
                showNotification("⚠️ El usuario ya realizó la encuesta 2. No puede volver a ingresar.", "warning", 4000);
                return;
            }

            // 🟢 Caso 3: Solo hizo la primera → puede continuar a la segunda
            if (data1 && !data2) {
                showNotification("🟢 Usuario encontrado, puede hacer la encuesta de logros 2", "success", 5000);
                setTimeout(() => {
                    navigate("/Inicio", { state: { usuario: data1 } });
                }, 1000);
                return;
            }

            // ⚠️ Caso 4: No está en ninguna → redirigir a JotForm
            if (!data1 && !data2) {
                showNotification("⚠️ El usuario aún no ha realizado la encuesta de logros 1", "warning", 5000);
                setTimeout(() => {
                    window.location.href = "https://form.jotform.com/251063743711047";
                }, 1500);
                return;
            }

        } catch (err) {
            console.error("❌ Error al verificar cédula:", err);
            showNotification("❌ Hubo un problema con la búsqueda", "error", 5000);
        }
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
                        if (e.key === "Enter") verificarCedula();
                    }}
                />

                <p className="cedula-help">Ingrese su Número de Cédula</p>

                <CustomButton
                    onClick={verificarCedula}
                    label="Iniciar Sesión"
                    className="btn-mobile-only"
                />
            </div>

            <div className="Imagen-gif">
                <img src={Gif} className="gif" alt="Gif animado" />
            </div>

            <NotificationContainer />
        </div>
    );
}
