import { API_URL } from "@/lib/config";

export async function registerUser(userJSON: string) {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: userJSON,
  });

  return response;
}

export async function loginUser(userJSON: string) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: userJSON,
  });

  return response;
}
