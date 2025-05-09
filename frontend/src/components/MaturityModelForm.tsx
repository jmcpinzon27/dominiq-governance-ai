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
  // ... estados anteriores

  // al montar: carga catálogos sin filtro
  useEffect(() => {
    getIndustries().then(setIndustries);
    getRoles().then(setRoles);
    getAxes().then(setAxes);
  }, []);

  // cada vez que cambia industry -> recarga companies
  useEffect(() => {
    if (industry !== undefined) {
      getCompanies(industry).then(setCompanies);
      setCompany(undefined);
      setProjects([]);
      setProject(undefined);
    }
  }, [industry]);

  // cada vez que cambia company -> recarga projects
  useEffect(() => {
    if (company !== undefined) {
      getProjects(company).then(setProjects);
      setProject(undefined);
    }
  }, [company]);

  // handler submit    ...

  return (
    <form className="card" onSubmit={onSubmit}>
      <h2>Modelo de Madurez</h2>

      <select
        value={industry ?? ""}
        onChange={e => {
          const v = e.target.value;
          setIndustry(v ? Number(v) : undefined);
        }}
      >
        <option value="">-- Industria --</option>
        {industries.map(i => (
          <option key={i.id} value={i.id}>{i.name}</option>
        ))}
      </select>

      <select
        value={company ?? ""}
        onChange={e => {
          const v = e.target.value;
          setCompany(v ? Number(v) : undefined);
        }}
        disabled={industry === undefined}
      >
        <option value="">-- Cliente --</option>
        {companies.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <select
        value={project ?? ""}
        onChange={e => {
          const v = e.target.value;
          setProject(v ? Number(v) : undefined);
        }}
        disabled={company === undefined}
      >
        <option value="">-- Proyecto --</option>
        {projects.map(p => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
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
        onChange={e => {
          const v = e.target.value;
          setAxis(v ? Number(v) : undefined);
        }}
      >
        <option value="">-- Eje --</option>
        {axes.map(a => (
          <option key={a.id} value={a.id}>{a.name}</option>
        ))}
      </select>

      <select
        value={role ?? ""}
        onChange={e => {
          const v = e.target.value;
          setRole(v ? Number(v) : undefined);
        }}
      >
        <option value="">-- Rol --</option>
        {roles.map(r => (
          <option key={r.id} value={r.id}>{r.name}</option>
        ))}
      </select>

      <button type="submit" className="btn-primary">
        Enviar Invitación
      </button>
    </form>
  );
}


