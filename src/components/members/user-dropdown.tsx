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
import { userStore } from "@/stores/user-store";
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
  const userSnapshot = useSnapshot(userStore);
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
                    loading: "выгоняем пользователя...",
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
                      return `пользователь ${userName} успешно выгнан из проекта`;
                    },
                    error: () => {
                      return `ошибка при выгоне пользователя ${userName}`;
                    },
                  }
                );
              }}
            >
              <LogOut />
              <span>выгнать</span>
            </DropdownMenuItem>
          )}
        {userSnapshot.user?._id === userId && (
          <DropdownMenuItem
            onClick={() => {
              toast.promise(
                removeUserFromProject(
                  projectSnapshot.project?._id ?? "",
                  userId
                ),
                {
                  loading: "выходим с проетка...",
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

                    projectStore.loading = true;
                    projectStore.loading = false;

                    return `вы успешно вышли из проекта`;
                  },
                  error: () => {
                    return `ошибка при выходе из проекта ${userName}`;
                  },
                }
              );
            }}
          >
            <LogOut />
            <span>выйти</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
