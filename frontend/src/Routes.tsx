import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./views/Home";
import ModeloMadurez from "./views/ModeloMadurez";
import ChatModeloMadurez from "./components/ChatModeloMadurez";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/modelo-madurez-form" element={<ModeloMadurez/>}/>
        <Route path="/modelo-madurez/:sessionToken" element={<ChatModeloMadurez/>}/>
      </Routes>
    </BrowserRouter>
  );
}
