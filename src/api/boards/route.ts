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
