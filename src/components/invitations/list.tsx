"use client";

import { getInvitations } from "@/api/invitations/route";
import { invitationsStore } from "@/stores/invitations-store";
import { useEffect } from "react";
import { toast } from "sonner";
import { useSnapshot } from "valtio";

export function InvitationsList() {
  const invitationsSnapshot = useSnapshot(invitationsStore);

  useEffect(() => {
    async function fetchAndSetInvitations() {
      try {
        const response = await getInvitations();

        if (response.ok) {
          const data = await response.json();

          invitationsStore.invitations = data;
        }
      } catch {
        toast.error("Не удалось получить список приглашений");
      }
    }

    fetchAndSetInvitations();
  }, []);

  if (!invitationsSnapshot) {
  }

  return <div></div>;
}
