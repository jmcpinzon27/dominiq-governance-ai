// frontend/src/api/index.ts
const BASE = import.meta.env.VITE_API_BASE_URL;

export async function getIndustries() {
  const res = await fetch(`${BASE}/industries`);
  return res.json();
}

export async function getRoles() {
  const res = await fetch(`${BASE}/roles`);
  return res.json();
}

export async function getAxes() {
  const res = await fetch(`${BASE}/axes`);
  return res.json();
}

export async function getCompanies(industryId?: number) {
  const q = industryId ? `?industry_id=${industryId}` : "";
  const res = await fetch(`${BASE}/companies${q}`);
  return res.json();
}

export async function getProjects(companyId?: number) {
  const q = companyId ? `?company_id=${companyId}` : "";
  const res = await fetch(`${BASE}/projects${q}`);
  return res.json();
}

export async function submitResponsibles(payload: any) {
  const res = await fetch(`${BASE}/submit-responsibles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return res.json();
}
