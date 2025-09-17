import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Bienvenida from "./Pages/Bienvenida";
import Inicio from "./Pages/Inicio.jsx";
import Encuesta from "./Pages/Encuesta.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Bienvenida />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/Encuesta" element={<Encuesta />} />
      </Routes>
    </Router>
  );
}
