const API = import.meta.env.VITE_API_BASE_URL;

export async function fetchIndustries() {
  return fetch(`${API}/industries`).then(r=>r.json());
}
export async function fetchRoles() {
  return fetch(`${API}/roles`).then(r=>r.json());
}
export async function fetchAxes() {
  return fetch(`${API}/axes`).then(r=>r.json());
}
export async function submitResponsibles(payload: any) {
  return fetch(`${API}/submit-responsibles`, {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify(payload)
  }).then(r=>r.json());
}
export async function chatInit(token: string) {
  return fetch(`${API}/chat/init`, {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ session_token: token })
  }).then(r=>r.json());
}
export async function chatMessage(token: string, qid:number, ans:number) {
  return fetch(`${API}/chat/message`, {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ session_token: token, question_id: qid, answer: ans })
  }).then(r=>r.json());
}
