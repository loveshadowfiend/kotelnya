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
import { ChevronsUpDown, Edit, Loader2, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AddProject } from "./add-project";
import { verifyAuth } from "@/lib/auth";
import { Project } from "@/types";
import { useEffect, useState } from "react";
import React from "react";
import { NavCurrentProject } from "./nav-current-project";
import { Button } from "../ui/button";
import { projectsStore } from "@/stores/projects-store";
import { useSnapshot } from "valtio";
import { projectStore } from "@/stores/project-store";
import { userStore } from "@/stores/user-store";
import { useRouter } from "next/navigation";
import { getProjects } from "@/api/projects/route";
import { ProjectManagement } from "./project-management";
import { API_URL } from "@/lib/config";

export function NavProjects() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const userSnapshot = useSnapshot(userStore);
  const projectSnapshot = useSnapshot(projectStore);
  const projectsSnapshot = useSnapshot(projectsStore);

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
            <DropdownMenuLabel>проекты</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {projectsSnapshot.loading && (
              <div className="flex items-center justify-center overflow-hidden py-3">
                <Loader2 className="animate-spin" />
              </div>
            )}
            {!projectsSnapshot.loading &&
              projectsSnapshot.projects?.map((project) => {
                return (
                  <div
                    key={project._id}
                    className="relative group flex items-center gap-2 p-2 hover:bg-muted cursor-pointer rounded-sm h-fit"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isOpen) return;

                      // @ts-ignore
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
                      <AvatarImage src={`${API_URL}${project.imageUrl}`} />
                      <AvatarFallback className="rounded-lg text-sm text-muted-foreground">
                        {project.title.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm">{project.title}</p>
                      <p className="text-sm text-muted-foreground overflow-hidden truncate">
                        {project.status}
                      </p>
                    </div>
                    <div
                      className="flex items-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ProjectManagement
                        setIsOpen={setIsOpen}
                        project={project}
                      >
                        <div className="absolute flex right-3 z-50">
                          <Button
                            className="h-5 w-5 text-muted-foreground z-50 lg:hidden group-hover:flex"
                            variant="ghost"
                          >
                            <Edit />
                          </Button>
                        </div>
                      </ProjectManagement>
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
                    добавить проект
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
