import axios from 'axios';

// DummyJSON base — fallback to mockData if fails
export const api = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 8000,
});

api.interceptors.request.use(cfg=>{
  const token = localStorage.getItem('hms_token');
  if(token) (cfg.headers as any).Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(res=>res, err=>{
  const status = err.response?.status;
  // Map to meaningful messages — consumer shows toast
  if(status===401) localStorage.removeItem('hms_token');
  return Promise.reject(err);
});

// Simple CRUD helpers with fallback awareness
export const fetchPatients = async () => {
  try {
    const { data } = await api.get('/users?limit=30');
    return data.users;
  } catch {
    return null; // caller will use mock
  }
};
