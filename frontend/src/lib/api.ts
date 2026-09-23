/**
 * Frontend API Utility Module
 * Prepared for future Django REST API integration.
 */

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export const fetcher = async <T>(url: string): Promise<T> => {
  const res = await fetch(url.startsWith("http") || url.startsWith("/") ? url : `/api${url}`);
  if (!res.ok) {
    throw new Error(`API error: ${res.statusText}`);
  }
  return res.json();
};

export const postData = async <T>(url: string, data?: unknown): Promise<T> => {
  const res = await fetch(url.startsWith("http") || url.startsWith("/") ? url : `/api${url}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: data ? JSON.stringify(data) : undefined,
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.statusText}`);
  }
  return res.json();
};

export const patchData = async <T>(url: string, data: unknown): Promise<T> => {
  const res = await fetch(url.startsWith("http") || url.startsWith("/") ? url : `/api${url}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.statusText}`);
  }
  return res.json();
};

export const deleteData = async (url: string): Promise<boolean> => {
  const res = await fetch(url.startsWith("http") || url.startsWith("/") ? url : `/api${url}`, {
    method: "DELETE",
  });
  return res.ok;
};

export const uploadFile = async <T>(url: string, form: FormData): Promise<T> => {
  const res = await fetch(url.startsWith("http") || url.startsWith("/") ? url : `/api${url}`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    throw new Error(`Upload error: ${res.statusText}`);
  }
  return res.json();
};

export default {
  fetcher,
  postData,
  patchData,
  deleteData,
  uploadFile,
};
