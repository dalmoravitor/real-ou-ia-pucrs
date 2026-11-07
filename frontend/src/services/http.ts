import { API_BASE_URL } from "../config/game";

export async function request<T>(path: string, errorMessage: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, init);
  if (!res.ok) throw new Error(errorMessage);
  return res.json();
}

export function postJson<T>(path: string, body: unknown, errorMessage: string): Promise<T> {
  return request<T>(path, errorMessage, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
