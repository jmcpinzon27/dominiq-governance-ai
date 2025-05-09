import React, { useState, useEffect, FormEvent } from "react";
import {
  getIndustries,
  getRoles,
  getAxes,
  getCompanies,
  getProjects,
  submitResponsibles,
} from "../api";

export default function MaturityModelForm() {
  // Opciones
  const [industries, setIndustries] = useState<{ id: number; name: string }[]>([]);
  const [companies, setCompanies]   = useState<{ id: number; name: string }[]>([]);
  const [projects, setProjects]     = useState<{ id: number; name: string }[]>([]);
  const [roles, setRoles]           = useState<{ id: number; name: string }[]>([]);
  const [axes, setAxes]             = useState<{ id: number; name: string }[]>([]);

  // Valores seleccionados
  const [industry, setIndustry]           = useState<number|undefined>(undefined);
  const [company, setCompany]             = useState<number|undefined>(undefined);
  const [project, setProject]             = useState<number|undefined>(undefined);
  const [responsibleName, setResponsibleName] = useState("");
  const [email, setEmail]                 = useState("");
  const [role, setRole]                   = useState<number|undefined>(undefined);
  const [axis, setAxis]                   = useState<number|undefined>(undefined);

  // Carga catálogos al montar
  useEffect(() => {
    getIndustries().then(setIndustries);
    getRoles().then(setRoles);
    getAxes().then(setAxes);
  }, []);

  // Al cambiar industria → recarga clientes
  useEffect(() => {
    if (industry != null) {
      getCompanies(industry).then(setCompanies);
      setCompany(undefined);
      setProjects([]);
      setProject(undefined);
    }
  }, [industry]);

  // Al cambiar cliente → recarga proyectos
  useEffect(() => {
    if (company != null) {
      getProjects(company).then(setProjects);
      setProject(undefined);
    }
  }, [company]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!industry || !company || !project || !axis || !role || !responsibleName || !email) {
      return alert("Por favor completa todos los campos.");
    }
    await submitResponsibles({
      cliente:   companies.find(c => c.id === company)!.name,
      proyecto:  projects.find(p => p.id === project)!.name,
      industria: industry,
      responsables: [{
        name:  responsibleName,
        email,
        role,
        eje: axis
      }]
    });
    alert("¡Invitación enviada!");
  };

  return (
    <form className="card" onSubmit={onSubmit}>
      <h2>Modelo de Madurez</h2>

      <select
        value={industry ?? ""}
        onChange={e => setIndustry(e.target.value ? Number(e.target.value) : undefined)}
      >
        <option value="">-- Industria --</option>
        {industries.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
      </select>

      <select
        value={company ?? ""}
        onChange={e => setCompany(e.target.value ? Number(e.target.value) : undefined)}
        disabled={!industry}
      >
        <option value="">-- Cliente --</option>
        {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>

      <select
        value={project ?? ""}
        onChange={e => setProject(e.target.value ? Number(e.target.value) : undefined)}
        disabled={!company}
      >
        <option value="">-- Proyecto --</option>
        {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>

      <input
        type="text"
        placeholder="Responsable"
        value={responsibleName}
        onChange={e => setResponsibleName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <select
        value={axis ?? ""}
        onChange={e => setAxis(e.target.value ? Number(e.target.value) : undefined)}
      >
        <option value="">-- Eje --</option>
        {axes.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
      </select>

      <select
        value={role ?? ""}
        onChange={e => setRole(e.target.value ? Number(e.target.value) : undefined)}
      >
        <option value="">-- Rol --</option>
        {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
      </select>

      <button type="submit" className="btn-primary">
        Enviar Invitación
      </button>
    </form>
  );
}


