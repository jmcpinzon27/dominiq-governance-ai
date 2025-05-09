// frontend/src/views/Home.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import iconDominiQ from "../assets/images/11.png";  // tu icono

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="h-screen flex items-center justify-center">
      <div
        className="card cursor-pointer text-center"
        style={{ width: 320 }}
        onClick={() => navigate("/modelo-madurez-form")}
      >
        <div className="flex justify-center -mt-12">
          <img
            src={iconDominiQ}
            alt="DominiQ"
            className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
          />
        </div>
        <h2 className="text-xl font-bold mt-4">DOMINIQ</h2>
        <p className="mt-2 px-4 text-gray-700">
          Agente de IA que apoya en la definición end-to-end de modelos de
          gobierno de datos.
        </p>
      </div>
    </div>
  );
}