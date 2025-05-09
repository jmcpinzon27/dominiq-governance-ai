import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MaturityModelForm from "../components/MaturityModelForm";

export default function ModeloMadurez() {
  return (
    <div className="flex h-screen">
      <Sidebar/>
      <div className="flex-1 flex flex-col">
        <Header/>
        <main className="p-6 overflow-auto bg-gray-100">
          <MaturityModelForm/>
        </main>
      </div>
    </div>
  );
}

