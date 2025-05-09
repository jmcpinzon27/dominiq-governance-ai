// frontend/src/api/index.ts

const BASE = import.meta.env.VITE_API_BASE_URL;

export async function getIndustries() {
  const res = await fetch(`${BASE}/industries`);
  if (!res.ok) throw new Error("Error cargando industrias");
  return res.json() as Promise<{ id:number; name:string }[]>;
}

// ... igual para getRoles(), getAxes(), getCompanies(), getProjects()

export interface ResponsiblePayload {
  cliente: string;
  proyecto: string;
  industria: number;
  responsables: Array<{ name:string; email:string; role:number; eje:number }>;
}

export async function submitResponsibles(payload: ResponsiblePayload) {
  const res = await fetch(`${BASE}/submit-responsibles`, {
    method: "POST",
    headers: { "Content-Type":"application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error("Error al enviar invitación");
  return res.json();
}

