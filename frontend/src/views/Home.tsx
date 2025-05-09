import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const nav = useNavigate();
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div
        className="w-80 bg-white rounded shadow cursor-pointer"
        onClick={()=>nav("/modelo-madurez-form")}
      >
        <img src="/dominiq.png" alt="DominiQ" className="w-full h-40 object-cover rounded-t"/>
        <div className="p-4 text-center">
          <h3 className="font-bold">DOMINIQ</h3>
          <p>Agente de IA para modelos de gobierno de datos</p>
        </div>
      </div>
    </div>
  );
}

