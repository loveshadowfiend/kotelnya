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

export async function forgotPassword(email: string) {
  const response = await fetch(`${API_URL}/api/auth/forgotpassword`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email }),
  });

  return response;
}

export async function resetPassword(token: string, password: string) {
  const response = await fetch(`${API_URL}/api/auth/resetpassword/${token}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: password }),
  });

  return response;
}

export async function checkResetToken(token: string) {
  const response = await fetch(
    `${API_URL}/api/auth/check-reset-token/${token}`,
    {
      method: "GET",
    }
  );

  return response;
}
