import { getAuthToken } from "@/lib/auth";
import { API_URL } from "@/lib/config";

export async function getBoard(boardId: string) {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/boards/${boardId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
}

export async function getBoards(projectId: string) {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/projects/${projectId}/boards`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
}

export async function deleteBoard(boardId: string) {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/boards/${boardId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
}

export async function addBoard(projectId: string, title: string) {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/projects/${projectId}/boards`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });

  return response;
}

export async function updateBoard(boardId: string, data: any) {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/boards/${boardId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response;
}
