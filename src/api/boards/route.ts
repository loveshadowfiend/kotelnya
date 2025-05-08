import { getAuthToken } from "@/lib/auth";
import { API_URL } from "@/lib/config";

export async function getBoard(boardId: string) {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/boards/${boardId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
}

export async function deleteBoard(boardId: string) {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/boards/${boardId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
}

export async function addBoard(projectId: string) {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/projects/${projectId}/boards`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response;
}
