"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronsUpDown, Loader2, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AddProject } from "./add-project";
import { verifyAuth } from "@/lib/auth";
import { Project } from "@/types";
import { useEffect } from "react";
import { NavCurrentProject } from "./nav-current-project";
import { Button } from "../ui/button";
import { deleteProject, projectsStore } from "@/stores/projects-store";
import { useSnapshot } from "valtio";
import { projectStore } from "@/stores/project-store";
import { userStore } from "@/stores/user-store";
import { useRouter } from "next/navigation";
import { getProjects } from "@/api/projects/route";

export function NavProjects() {
  const router = useRouter();
  const userSnapshot = useSnapshot(userStore);
  const projectSnapshot = useSnapshot(projectStore);
  const projectsSnapshot = useSnapshot(projectsStore);

  const handleDelete = async (projectId: string) => {
    deleteProject(projectId);
  };

  useEffect(() => {
    const fetchProjects = async () => {
      projectsStore.loading = true;

      const payload = await verifyAuth();

      if (payload === null) {
        return;
      }

      const response = await getProjects((payload as { id: string }).id);

      if (response.ok) {
        const projects = await response.json();

        projectsStore.projects = projects;
      }

      projectsStore.loading = false;
    };

    fetchProjects();
  }, []);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              className="flex justify-between max-w-full"
              size="lg"
            >
              <NavCurrentProject />
              <ChevronsUpDown />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="relative w-60 shadow-none"
            align="center"
          >
            <DropdownMenuLabel>Проекты</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {projectsSnapshot.loading && (
              <div className="flex items-center justify-center overflow-hidden py-3">
                <Loader2 className="animate-spin" />
              </div>
            )}
            {!projectsSnapshot.loading &&
              projectsStore.projects?.map((project: Project) => {
                return (
                  <div
                    key={project._id}
                    className="relative group flex items-center gap-2 p-2 hover:bg-muted cursor-pointer rounded-sm h-fit"
                    onClick={() => {
                      projectStore.project = project;

                      localStorage.setItem(
                        "currentProject",
                        JSON.stringify({
                          id: project._id,
                          userId: userSnapshot.user?._id,
                        })
                      );

                      router.push("/");
                    }}
                  >
                    <Avatar className="rounded-lg">
                      <AvatarImage src="" />
                      <AvatarFallback className="rounded-lg" />
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm">{project.title}</p>
                      <p className="text-sm text-muted-foreground overflow-hidden truncate">
                        {project.status}
                      </p>
                    </div>
                    <div className="absolute flex right-3 z-50">
                      {/* <Button
                        className="text-muted-foreground w-5 h-5"
                        variant="ghost"
                      >
                        <Edit />
                      </Button> */}
                      <Button
                        className="hidden text-muted-foreground w-5 h-5 group-hover:inline-flex"
                        variant="ghost"
                        onClick={() => handleDelete(project._id)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </div>
                );
              })}
            {!projectsStore.loading && (
              <AddProject>
                <div className="flex items-center gap-2 p-2 hover:bg-muted cursor-pointer rounded-sm h-fit">
                  <Avatar className="rounded-lg">
                    <AvatarFallback className="rounded-lg">+</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground font-medium">
                    Добавить проект
                  </span>
                </div>
              </AddProject>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
