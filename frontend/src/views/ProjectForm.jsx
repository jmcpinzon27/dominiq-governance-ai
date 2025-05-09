import React from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

export default function ProjectForm() {
  const nav = useNavigate();
  const handleCreate = () => { /* lógica de creación + nav('/modelo-madurez-form') */ };
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Nuevo Proyecto</h2>
        {/* Formulario de creación */}
        <button
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
