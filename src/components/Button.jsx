import React from "react";
import "./Button.css";

const CustomButton = ({ onClick, label, type = "button", className = "" }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`custom-button ${className}`}
        >
            {label}
        </button>
    );
};

export default CustomButton;
