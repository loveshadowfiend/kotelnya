import { getAuthToken } from "@/lib/auth";
import { API_URL } from "@/lib/config";

export async function deleteProject(projectId: string) {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/projects/${projectId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
}
