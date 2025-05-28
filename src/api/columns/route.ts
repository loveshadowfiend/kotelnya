import { getAuthToken } from "@/lib/auth";
import { API_URL } from "@/lib/config";

export async function createColumn(boardId: string, title: string) {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/boards/${boardId}/columns`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: title,
    }),
  });

  return response;
}

export async function deleteColumn(columnId: string) {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/columns/${columnId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
}
