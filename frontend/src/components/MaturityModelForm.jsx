import React, { useEffect, useState } from "react";
import { fetchIndustries, fetchRoles, fetchAxes, submitResponsibles } from "../api";

export default function MaturityModelForm() {
  const [industries, setIndustries] = useState([]);
  const [roles, setRoles]           = useState([]);
  const [axes, setAxes]             = useState([]);
  const [form, setForm]             = useState({
    industria: "", cliente:"", proyecto:"", responsables: [{ name:"", email:"", role:"", eje:"" }]
  });

  useEffect(()=>{
    fetchIndustries().then(setIndustries);
    fetchRoles().then(setRoles);
    fetchAxes().then(setAxes);
  },[]);

  const addRow = () => {
    setForm(f=>({...f, responsables: [...f.responsables, {name:"",email:"",role:"",eje:""}]}));
  };

  const onChangeRow = (i: number, k: string, v:string) => {
    const rs = [...form.responsables];
    (rs[i] as any)[k] = v;
    setForm(f=>({...f, responsables: rs}));
  };

  const onSubmit = () => {
    submitResponsibles(form).then(res=>{
      alert("Invitaciones enviadas");
    });
  };

  return (
    <div className="bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-xl font-bold">Modelo de Madurez</h2>
      <div className="space-y-2">
        <select onChange={e=>setForm(f=>({...f, industria:e.target.value}))}>
          <option value="">-- Industria --</option>
          {industries.map((i:any)=><option key={i.industry_id} value={i.industry_id}>{i.industry_name}</option>)}
        </select>
        <input placeholder="Cliente" onChange={e=>setForm(f=>({...f, cliente:e.target.value}))}/>
        <input placeholder="Proyecto" onChange={e=>setForm(f=>({...f, proyecto:e.target.value}))}/>
      </div>
      {form.responsables.map((r, i) => (
        <div key={i} className="flex space-x-2">
          <input placeholder="Responsable" value={r.name}
            onChange={e=>onChangeRow(i,"name",e.target.value)}/>
          <input placeholder="Email" value={r.email}
            onChange={e=>onChangeRow(i,"email",e.target.value)}/>
          <select value={r.eje} onChange={e=>onChangeRow(i,"eje",e.target.value)}>
            <option value="">-- Eje --</option>
            {axes.map((a:any)=><option key={a.axis_id} value={a.axis_id}>{a.axis_name}</option>)}
          </select>
          <select value={r.role} onChange={e=>onChangeRow(i,"role",e.target.value)}>
            <option value="">-- Rol --</option>
            {roles.map((rl:any)=><option key={rl.role_id} value={rl.role_id}>{rl.role_name}</option>)}
          </select>
        </div>
      ))}
      <button onClick={addRow} className="bg-blue-500 text-white px-4 py-2 rounded">+ Agregar fila</button>
      <button onClick={onSubmit} className="w-full bg-green-600 text-white px-4 py-2 rounded">Enviar Invitación</button>
    </div>
  );
}
