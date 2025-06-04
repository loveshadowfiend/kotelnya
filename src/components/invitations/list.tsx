"use client";

import { getInvitations } from "@/api/invitations/route";
import { invitationsStore } from "@/stores/invitations-store";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSnapshot } from "valtio";
import { Skeleton } from "../ui/skeleton";
import { InvitationCard } from "./card";
import { Inbox, Mail } from "lucide-react";

export function InvitationsList() {
  const [isEmpty, setIsEmpty] = useState(true);
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

  if (!invitationsSnapshot.invitations) {
    return (
      <div className="w-full">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="w-full h-23 mb-3" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {invitationsSnapshot.invitations?.map((invitation, index) => {
        if (
          invitation.status === "accepted" ||
          invitation.status === "rejected"
        ) {
          return;
        } else if (isEmpty) {
          setIsEmpty(false);
        }

        return <InvitationCard key={index} projectInvitation={invitation} />;
      })}
      {isEmpty && (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Inbox className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <Mail className="w-3 h-3 text-primary-foreground" />
            </div>
          </div>

          <h3 className="text-lg font-semibold text-foreground mb-2">
            нет активных приглашений ;(
          </h3>

          <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
            когда вас пригласят в новые проекты, приглашения появятся здесь, и
            тогда вы сможете принять или отклонить их
          </p>
        </div>
      )}
    </div>
  );
}
