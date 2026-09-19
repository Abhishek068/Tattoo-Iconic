import axios, { type InternalAxiosRequestConfig } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const api = axios.create({ baseURL: API_URL, headers: { "Content-Type": "application/json" }, timeout: 15000 });

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const orig = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && !orig._retry && typeof window !== "undefined") {
      orig._retry = true;
      try {
        const refresh = localStorage.getItem("refresh_token");
        if (!refresh) throw new Error("No refresh token");
        const { data } = await axios.post(`${API_URL}/auth/refresh/`, { refresh });
        localStorage.setItem("access_token", data.access);
        if (data.refresh) localStorage.setItem("refresh_token", data.refresh);
        if (orig.headers) orig.headers.Authorization = `Bearer ${data.access}`;
        return api(orig);
      } catch {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

export const fetcher = <T>(url: string) => api.get<T>(url).then((r) => r.data);
export const postData = <T>(url: string, data?: unknown) => api.post<T>(url, data).then((r) => r.data);
export const patchData = <T>(url: string, data: unknown) => api.patch<T>(url, data).then((r) => r.data);
export const deleteData = (url: string) => api.delete(url);
export const uploadFile = <T>(url: string, form: FormData) =>
  api.post<T>(url, form, { headers: { "Content-Type": "multipart/form-data" } }).then((r) => r.data);
