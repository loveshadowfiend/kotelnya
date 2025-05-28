import { getAuthToken } from "@/lib/auth";
import { API_URL } from "@/lib/config";

export async function getNotes(projectId: string) {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/projects/${projectId}/notes`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
}

export async function getNote(noteId: string) {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/notes/${noteId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
}

export async function deleteNote(noteId: string) {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/notes/${noteId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
}

export async function addNote(projectId: string, title: string) {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/projects/${projectId}/notes`, {
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

export async function updateNote(noteId: string, markdownContent: string) {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/notes/${noteId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      markdownContent: markdownContent,
    }),
  });

  return response;
}
