import axios from 'axios';
const BASE = import.meta.env.VITE_API_BASE_URL;

export const getIndustries = () =>
  axios.get(`${BASE}/industries`);

export const submitResponsibles = (payload) =>
  axios.post(`${BASE}/submit-responsibles`, payload);

export const chatInit = (token) =>
  axios.post(`${BASE}/chat/init`, { session_token: token });

export const chatMessage = (payload) =>
  axios.post(`${BASE}/chat/message`, payload);
