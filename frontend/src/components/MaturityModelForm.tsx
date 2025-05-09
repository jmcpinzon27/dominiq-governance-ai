// frontend/src/components/MaturityModelForm.tsx
import React, { useState, useEffect } from "react";
import {
  getIndustries,
  getRoles,
  getAxes,
  getCompanies,
  getProjects,
  submitResponsibles
} from "../api";

export default function MaturityModelForm() {
  // estados para options
  const [industries, setIndustries] = useState<{id:number,name:string}[]>([]);
  const [companies, setCompanies]   = useState<{id:number,name:string}[]>([]);
  const [projects, setProjects]     = useState<{id:number,name:string}[]>([]);
  const [roles, setRoles]           = useState<{id:number,name:string}[]>([]);
  const [axes, setAxes]             = useState<{id:number,name:string}[]>([]);

  // estados para seleccion / inputs
  const [industry, setIndustry] = useState<number>();
  const [company, setCompany]   = useState<number>();
  const [project, setProject]   = useState<number>();
  const [responsibleName, setResponsibleName] = useState("");
  const [email, setEmail]       = useState("");
  const [role, setRole]         = useState<number>();
  const [axis, setAxis]         = useState<number>();

  // al montar: carga catálogos sin filtro
  useEffect(()=>{
    getIndustries().then(setIndustries);
    getRoles().then(setRoles);
    getAxes().then(setAxes);
  },[]);

  // cada vez que cambia industry -> recarga companies
  useEffect(()=>{
    if(industry) {
      getCompanies(industry).then(setCompanies);
      setCompany(undefined);
      setProjects([]);
      setProject(undefined);
    }
  },[industry]);

  // cada vez que cambia company -> recarga projects
  useEffect(()=>{
    if(company) {
      getProjects(company).then(setProjects);
      setProject(undefined);
    }
  },[company]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!industry||!company||!project||!axis||!role||!responsibleName||!email) {
      alert("Por favor completa todos los campos.");
      return;
    }
    await submitResponsibles({
      cliente: companies.find(c=>c.id===company)!.name,
      proyecto: projects.find(p=>p.id===project)!.name,
      industria: industry,
      responsables: [
        {
          name: responsibleName,
          email,
          role: role,
          eje: axis
        }
      ]
    });
    alert("¡Invitación enviada!");
  };

  return (
    <form className="card" onSubmit={onSubmit}>
      <h2>Modelo de Madurez</h2>
      <select
        value={industry||""}
        onChange={e=>setIndustry(Number(e.target.value))}
      >
        <option value="">-- Industria --</option>
        {industries.map(i=>(
          <option key={i.id} value={i.id}>{i.name}</option>
        ))}
      </select>

      <select
        value={company||""}
        onChange={e=>setCompany(Number(e.target.value))}
        disabled={!industry}
      >
        <option value="">-- Cliente --</option>
        {companies.map(c=>(
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <select
        value={project||""}
        onChange={e=>setProject(Number(e.target.value))}
        disabled={!company}
      >
        <option value="">-- Proyecto --</option>
        {projects.map(p=>(
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Responsable"
        value={responsibleName}
        onChange={e=>setResponsibleName(e.target.value)}
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e=>setEmail(e.target.value)}
      />

      <select
        value={axis||""}
        onChange={e=>setAxis(Number(e.target.value))}
      >
        <option value="">-- Eje --</option>
        {axes.map(a=>(
          <option key={a.id} value={a.id}>{a.name}</option>
        ))}
      </select>

      <select
        value={role||""}
        onChange={e=>setRole(Number(e.target.value))}
      >
        <option value="">-- Rol --</option>
        {roles.map(r=>(
          <option key={r.id} value={r.id}>{r.name}</option>
        ))}
      </select>

      <button type="submit" className="btn-primary">
        Enviar Invitación
      </button>
    </form>
  );
}

