import { getAuthToken } from "@/lib/auth";
import { API_URL } from "@/lib/config";

export async function sendInvitation(projectId: string, userId: string) {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/invitations/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ projectId: projectId, userId: userId }),
  });

  return response;
}

export async function getInvitations() {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/invitations`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
}

export async function acceptInvitation(invitationId: string) {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/invitations/accept`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ invitationId: invitationId }),
  });

  return response;
}

export async function rejectInvitation(invitationId: string) {
  const token = await getAuthToken();
  const response = await fetch(`${API_URL}/api/invitations/reject`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ invitationId: invitationId }),
  });

  return response;
}
