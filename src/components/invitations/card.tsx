import { Card, CardHeader } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { ProjectInvitation } from "@/types";
import { toast } from "sonner";
import { acceptInvitation, rejectInvitation } from "@/api/invitations/route";
import { projectsStore } from "@/stores/projects-store";
import { invitationsStore } from "@/stores/invitations-store";

interface InvitationCardProps {
  projectInvitation: ProjectInvitation;
}

export function InvitationCard({ projectInvitation }: InvitationCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3 ">
          <Avatar className="rounded-md">
            <AvatarImage src="" />
            <AvatarFallback className="flex items-center justify-center text-sm rounded-lg aspect-square bg-accent text-muted-foreground">
              {(projectInvitation.projectName ?? "").substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <span>{projectInvitation.projectName}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => {
              toast.promise(acceptInvitation(projectInvitation._id), {
                loading: "Принятие приглашения...",
                success: async (response) => {
                  const data = await response.json();
                  projectsStore.projects?.push(data);
                  invitationsStore?.invitations?.filter(
                    (invitation) => invitation._id !== projectInvitation._id
                  );

                  return "Приглашения принято";
                },
                error: () => {
                  return "Не удалось принять приглашение";
                },
              });
            }}
          >
            Принять
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              toast.promise(rejectInvitation(projectInvitation._id), {
                loading: "Отклонение приглашения...",
                success: async () => {
                  const newInvitations =
                    invitationsStore?.invitations?.filter(
                      (invitation) => invitation._id !== projectInvitation._id
                    ) ?? [];
                  invitationsStore.invitations = newInvitations;

                  return "Приглашение отклонено";
                },
                error: () => {
                  return "Не удалось отклонить приглашение";
                },
              });
            }}
          >
            Отклонить
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}
