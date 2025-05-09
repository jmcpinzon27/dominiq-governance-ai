// frontend/src/api/index.ts

const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// ---- Catalog Endpoints ----
export async function getIndustries(): Promise<{ id: number; name: string }[]> {
  const res = await fetch(`${BASE}/industries`);
  if (!res.ok) throw new Error("Error cargando industrias");
  return res.json();
}

export async function getRoles(): Promise<{ id: number; name: string }[]> {
  const res = await fetch(`${BASE}/roles`);
  if (!res.ok) throw new Error("Error cargando roles");
  return res.json();
}

export async function getAxes(): Promise<{ id: number; name: string }[]> {
  const res = await fetch(`${BASE}/axes`);
  if (!res.ok) throw new Error("Error cargando ejes");
  return res.json();
}

export async function getCompanies(
  industryId?: number
): Promise<{ id: number; name: string }[]> {
  const query = industryId ? `?industry_id=${industryId}` : "";
  const res = await fetch(`${BASE}/companies${query}`);
  if (!res.ok) throw new Error("Error cargando clientes");
  return res.json();
}

export async function getProjects(
  companyId?: number
): Promise<{ id: number; name: string }[]> {
  const query = companyId ? `?company_id=${companyId}` : "";
  const res = await fetch(`${BASE}/projects${query}`);
  if (!res.ok) throw new Error("Error cargando proyectos");
  return res.json();
}

// ---- Submit Endpoint ----
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
    const text = await res.text();
    throw new Error("Error al enviar invitación: " + text);
  }
  return res.json();
}


