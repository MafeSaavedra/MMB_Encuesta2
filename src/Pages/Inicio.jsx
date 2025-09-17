import { useLocation, useNavigate } from "react-router-dom"; // 👈 AHORA SÍ LOS DOS
import "./Inicio.css";
import cohete from "../Img/img-cohete.png";

export default function Inicio() {
    const location = useLocation();
    const usuario = location.state?.usuario;
    const navigate = useNavigate(); // ✅ ya funciona

    const irAEncuesta = () => {
        navigate("/Encuesta", { state: { usuario } });
    };
    return (
        <div className="General">
            <div className="title">
                <h1 className="Title-bienvenida">Bienvenid@ de nuevo  {usuario?.nombre} {usuario?.apellido} !</h1>
            </div>
            <div className="col1">
                <img src={cohete} className="cohete-img" alt="Gif animado" />
            </div>
            <div className="col2">
                {/* Título */}
                <h1>
                    <span className="verde-principal">¡Felicidades!</span>
                </h1>

                {/* Subtítulo */}
                <p className="parrafo">
                    Has llegado a la{" "}
                    <span className="verde">segunda etapa</span> de tu proceso
                </p>

                {/* Texto descriptivo */}
                <p className="parrafo">
                    Queremos conocerte mejor, por eso con tus expectativas y síntomas en
                    mente, respóndenos esta <span className="verde">encuesta</span> para{" "}
                    <span className="verde">evaluar tu avance.</span>
                </p>

                {/* Botón */}
                <button className="boton-encuesta" onClick={irAEncuesta}>
                    Responder Encuesta
                </button>
            </div>


        </div>
    );
}
