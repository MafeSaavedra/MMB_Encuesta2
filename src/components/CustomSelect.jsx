// src/components/CustomSelect.jsx
import React from "react";
import "./CustomSelect.css"; // aquí pondremos los estilos

export default function CustomSelect({ label, value, onChange, options }) {
    return (
        <div className="custom-select-container">
            {label && <label className="custom-select-label">{label}</label>}
            <select
                className="custom-select"
                value={value}
                onChange={onChange}
            >
                <option value="">-- Selecciona --</option>
                {options.map((opcion, idx) => (
                    <option key={idx} value={opcion}>
                        {opcion}
                    </option>
                ))}
            </select>
        </div>
    );
}
