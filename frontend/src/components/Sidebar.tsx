import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <nav className="w-60 bg-gray-900 text-white p-4 flex flex-col space-y-2">
      <NavLink to="/modelo-madurez-form" className="px-3 py-2 rounded hover:bg-gray-700">
        Modelo de Madurez
      </NavLink>
      {/* elimina las otras cartas */}
    </nav>
  );
}
