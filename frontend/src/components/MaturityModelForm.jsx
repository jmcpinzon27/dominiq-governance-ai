import React, { useEffect, useState } from 'react';
import { getIndustries, submitResponsibles } from '../api/admin';

export default function MaturityModelForm() {
  const [industries, setIndustries] = useState([]);
  const [cliente, setCliente] = useState('');
  const [proyecto, setProyecto] = useState('');
  const [industria, setIndustria] = useState('');
  const [rows, setRows] = useState([
    { name:'', email:'', eje:'', role:'' }
  ]);

  useEffect(() => {
    getIndustries().then(r => setIndustries(r.data));
  }, []);

  const updateRow = (i, field, val) => {
    const copy = [...rows];
    copy[i][field] = val;
    setRows(copy);
  };

  const addRow = () =>
    setRows([...rows, { name:'', email:'', eje:'', role:'' }]);

  const removeRow = (i) =>
    setRows(rows.filter((_,idx)=>idx!==i));

  const handleSubmit = () => {
    submitResponsibles({
      cliente, proyecto, industria, responsables: rows
    })
    .then(()=>alert('Invitaciones enviadas!'))
    .catch(e=>console.error(e));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          placeholder="Cliente"
          value={cliente}
          onChange={e=>setCliente(e.target.value)}
          className="p-2 border rounded flex-1"
        />
        <input
          placeholder="Proyecto"
          value={proyecto}
          onChange={e=>setProyecto(e.target.value)}
          className="p-2 border rounded flex-1"
        />
        <select
          value={industria}
          onChange={e=>setIndustria(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Industria</option>
          {industries.map(i=>(
            <option key={i.industry_id} value={i.industry_id}>
              {i.industry_name}
            </option>
          ))}
        </select>
      </div>

      {rows.map((r,i)=>(
        <div key={i} className="flex gap-2">
          <input
            placeholder="Responsable"
            value={r.name}
            onChange={e=>updateRow(i,'name',e.target.value)}
            className="p-2 border rounded flex-1"
          />
          <input
            placeholder="Email"
            value={r.email}
            onChange={e=>updateRow(i,'email',e.target.value)}
            className="p-2 border rounded flex-1"
          />
          <input
            placeholder="Eje (ID)"
            value={r.eje}
            onChange={e=>updateRow(i,'eje',e.target.value)}
            className="p-2 border rounded w-24"
          />
          <input
            placeholder="Rol (ID)"
            value={r.role}
            onChange={e=>updateRow(i,'role',e.target.value)}
            className="p-2 border rounded w-24"
          />
          <button
            onClick={()=>removeRow(i)}
            className="bg-red-500 text-white p-2 rounded"
          >
            Eliminar
          </button>
        </div>
      ))}

      <button
        onClick={addRow}
        className="bg-green-500 text-white p-2 rounded"
      >
        + Añadir responsable
      </button>

      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-500 text-white p-2 rounded"
      >
        Enviar Invitaciones
      </button>
    </div>
  );
}
