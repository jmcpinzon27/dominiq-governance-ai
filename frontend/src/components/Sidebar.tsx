// frontend/src/components/Sidebar.tsx
import React from "react"
import { NavLink } from "react-router-dom"

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <NavLink
        to="/modelo-madurez-form"
        className={({ isActive }) => isActive ? "active" : ""}
      >
        Modelo de Madurez
      </NavLink>
    </aside>
  )
}

