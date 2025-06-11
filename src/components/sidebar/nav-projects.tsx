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

export function NavProjects() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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
              projectsStore.projects?.map((project: Project) => {
                return (
                  <div
                    key={project._id}
                    className="relative group flex items-center gap-2 p-2 hover:bg-muted cursor-pointer rounded-sm h-fit"
                    onClick={(e) => {
                      // Prevent click if the event originated from the ProjectManagement button or its children
                      if (
                        (e.target as HTMLElement).closest(
                          ".project-management-btn"
                        )
                      ) {
                        return;
                      }
                      e.stopPropagation();
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
                    <ProjectManagement project={project}>
                      <div className="absolute flex right-3 z-50">
                        <Button
                          className="h-5 w-5 text-muted-foreground z-50 hidden group-hover:flex"
                          variant="ghost"
                        >
                          <Edit />
                        </Button>
                      </div>
                    </ProjectManagement>
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
