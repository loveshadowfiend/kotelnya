"use client";

import { useSnapshot } from "valtio";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { projectStore } from "@/stores/project-store";
import { useEffect } from "react";
import { createProject, getProject } from "@/api/projects/route";
import { userStore } from "@/stores/user-store";
import { getUserProjects } from "@/api/users/route";
import { verifyAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Project } from "@/types";
import { Skeleton } from "../ui/skeleton";

export function NavCurrentProject() {
  const router = useRouter();
  const projectSnapshot = useSnapshot(projectStore);
  const userSnapshot = useSnapshot(userStore);

  useEffect(() => {
    if (!userSnapshot.user) return;

    const fetchAndSetCurrentProject = async (projectId: string) => {
      const response = await getProject(projectId);

      if (response.ok) {
        const project = await response.json();
        projectStore.project = project;

        return project;
      } else {
        fetchAndSetFirstUserProject();

        return null;
      }
    };

    const fetchAndSetFirstUserProject = async () => {
      const payload = await verifyAuth();

      if (!payload) {
        router.push("/auth/login");

        return;
      }

      const response = await getUserProjects((payload as { id: string }).id);

      if (response.ok) {
        const projects: Project[] = await response.json();

        if (projects.length > 0) {
          projectStore.project = projects[0];

          return projects[0];
        } else {
          const newProject = await createAndSetCurrentProject(
            `Проект ${userSnapshot.user?.username}`
          );

          return newProject;
        }
      } else {
        return null;
      }
    };

    const createAndSetCurrentProject = async (title: string) => {
      const response = await createProject(title);

      if (response.ok) {
        const project = await response.json();

        projectStore.project = project;

        return project;
      } else {
        return null;
      }
    };

    const currentProject = JSON.parse(
      localStorage.getItem("currentProject") ?? "null"
    );

    if (
      currentProject &&
      currentProject !== "null" &&
      currentProject.userId === userSnapshot.user._id
    ) {
      fetchAndSetCurrentProject(currentProject.id);
    } else {
      fetchAndSetFirstUserProject();
    }
  }, [userSnapshot]);

  if (!projectSnapshot.project) {
    return <Skeleton className="w-60 h-12" />;
  }

  return (
    <div className="flex items-center gap-2">
      <Avatar className="rounded-lg">
        <AvatarImage src="" />
        <AvatarFallback className="rounded-lg text-sm text-muted-foreground">
          {projectSnapshot.project.title.substring(0, 2)}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <p className="font-medium">{projectSnapshot.project.title}</p>
        <p className="text-muted-foreground overflow-hidden truncate">
          {projectSnapshot.project.status}
        </p>
      </div>
    </div>
  );
}
