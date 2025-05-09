// frontend/src/api/index.ts

const BASE = "/api"  // proxy de Vite a http://localhost:5000

export async function getIndustries() {
  const res = await fetch(`${BASE}/industries`);
  if (!res.ok) throw new Error("Error cargando industrias");
  return res.json() as Promise<{ id: number; name: string }[]>;
}

export async function getRoles() {
  const res = await fetch(`${BASE}/roles`);
  if (!res.ok) throw new Error("Error cargando roles");
  return res.json() as Promise<{ id: number; name: string }[]>;
}

export async function getAxes() {
  const res = await fetch(`${BASE}/axes`);
  if (!res.ok) throw new Error("Error cargando ejes");
  return res.json() as Promise<{ id: number; name: string }[]>;
}

export async function getCompanies(industryId?: number) {
  const q = industryId ? `?industry_id=${industryId}` : "";
  const res = await fetch(`${BASE}/companies${q}`);
  if (!res.ok) throw new Error("Error cargando clientes");
  return res.json() as Promise<{ id: number; name: string }[]>;
}

export async function getProjects(companyId?: number) {
  const q = companyId ? `?company_id=${companyId}` : "";
  const res = await fetch(`${BASE}/projects${q}`);
  if (!res.ok) throw new Error("Error cargando proyectos");
  return res.json() as Promise<{ id: number; name: string }[]>;
}

export interface ResponsiblePayload {
  cliente: string;
  proyecto: string;
  industria: number;
  responsables: Array<{
    name: string;
    email: string;
    role: number;
    eje: number;
  }>;
}

export async function submitResponsibles(payload: ResponsiblePayload) {
  const res = await fetch(`${BASE}/submit-responsibles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error("Error al enviar invitación: " + err);
  }
  return res.json();
}
