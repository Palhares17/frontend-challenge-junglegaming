import axios from 'axios';
import { waitForApi } from './readiness';

export const api = axios.create({
  baseURL: import.meta.env.SSR ? 'http://localhost/api' : import.meta.env.VITE_API_URL || '/api',
  timeout: 10_000,
});

api.interceptors.request.use(async (config) => {
  await waitForApi();
  return config;
});
