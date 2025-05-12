import { getAuthToken } from "@/lib/auth";
import { API_URL } from "@/lib/config";

export async function addTask(
  columnId: string,
  boardId: string,
  title: string
) {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/boards/${boardId}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title: title, columnId: columnId }),
  });

  return response;
}

export async function deleteTask(taskId: string) {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
}
