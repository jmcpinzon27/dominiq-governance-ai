import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Bienvenido a DominiQ</h2>
      <Link
        to="/dominiQ"
        className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded"
      >
        Crear Proyecto
      </Link>
    </div>
  );
}
