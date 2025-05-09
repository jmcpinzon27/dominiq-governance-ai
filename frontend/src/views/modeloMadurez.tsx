// frontend/src/views/modeloMadurez.tsx
import React from "react"
import Header  from "../components/Header"
import Sidebar from "../components/Sidebar"
import Form    from "../components/MaturityModelForm"

export default function ModeloMadurez() {
  return (
    <div className="app-container">
      <Sidebar />

      <div className="main-content">
        <Header />
        <div className="main-scroll">
          <Form />
        </div>
      </div>
    </div>
  )
}

