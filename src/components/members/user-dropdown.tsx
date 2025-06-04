import { removeUserFromProject } from "@/api/projects/route";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { projectStore } from "@/stores/project-store";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { useSnapshot } from "valtio";

export function MembersUserDropdown({
  userId,
  userName,
  role,
  children,
}: {
  userId: string;
  userName: string;
  role: string;
  children?: React.ReactNode;
}) {
  const projectSnapshot = useSnapshot(projectStore);

  if (!projectSnapshot.project) return;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{userName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {role !== "owner" &&
          (projectSnapshot.userRole === "owner" ||
            projectSnapshot.userRole === "admin") && (
            <DropdownMenuItem
              onClick={() => {
                toast.promise(
                  removeUserFromProject(
                    projectSnapshot.project?._id ?? "",
                    userId
                  ),
                  {
                    loading: "Выгоняем пользователя...",
                    success: () => {
                      if (projectStore.project) {
                        projectStore.project = {
                          ...projectStore.project,
                          _id: projectStore.project._id, // Ensure _id is always a valid string
                          users: projectStore.project.users.filter(
                            (user) => user.userId._id !== userId
                          ),
                        };
                      }
                      return `Пользователь ${userName} успешно выгнан из проекта`;
                    },
                    error: () => {
                      return `Ошибка при выгоне пользователя ${userName}`;
                    },
                  }
                );
              }}
            >
              <LogOut />
              <span>Выгнать</span>
            </DropdownMenuItem>
          )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
