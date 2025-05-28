import { getAuthToken } from "@/lib/auth";
import { API_URL } from "@/lib/config";

export async function getUser(userId: string) {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/users/${userId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
}

export async function getUserProjects(userId: string) {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/users/${userId}/projects`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
}

export async function searchUsers(query: string) {
  const token = await getAuthToken();
  const response = await fetch(
    `${API_URL}/api/users/search?query=${encodeURIComponent(query)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response;
}

export async function loadUserAvatar(userId: string, formData: FormData) {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/users/${userId}/avatar`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return response;
}
