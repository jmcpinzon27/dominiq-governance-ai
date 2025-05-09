// frontend/src/views/Home/Home.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import iconDominiQ from "../../assets/images/11.png";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="home-container">
      <div
        className="home-card"
        onClick={() => navigate("/modelo-madurez-form")}
      >
        <img
          src={iconDominiQ}
          alt="DominiQ"
          className="home-card-img"
        />
        <h3>DOMINIQ</h3>
        <p>
          Agente de IA que apoya en la definición end-to-end de
          modelos de gobierno de datos.
        </p>
      </div>
    </div>
  );
}
