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

export async function getProject(projectId: string) {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/projects/${projectId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
}

export async function getProjects(userId: string) {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/users/${userId}/projects`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  return response;
}

export async function createProject(title: string, status?: string) {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: title,
      status: status,
    }),
  });

  return response;
}

export async function addProjectMember(projectId: string, userId: string) {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/projects/${projectId}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      userId: userId,
    }),
  });

  return response;
}

export async function removeUserFromProject(projectId: string, userId: string) {
  const token = await getAuthToken();
  const response = await fetch(
    `${API_URL}/api/projects/${projectId}/users/${userId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response;
}

export async function changeUserRole(
  projectId: string,
  userId: string,
  role: "owner" | "admin" | "member"
) {
  const token = await getAuthToken();
  const response = await fetch(
    `${API_URL}/api/projects/${projectId}/users/${userId}/role`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: userId,
        newRole: role,
      }),
    }
  );

  return response;
}

export async function updateProject(
  projectId: string,
  title: string,
  status: string
) {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/projects/${projectId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: title,
      status: status,
    }),
  });

  return response;
}

export async function loadProjectAvatar(projectId: string, formData: FormData) {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/projects/${projectId}/image`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return response;
}
