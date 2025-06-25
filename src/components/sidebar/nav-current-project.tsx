"use client";

import { useSnapshot } from "valtio";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { projectStore } from "@/stores/project-store";
import { useEffect, useRef, useCallback } from "react";
import { createProject, getProject } from "@/api/projects/route";
import { userStore } from "@/stores/user-store";
import { getUserProjects } from "@/api/users/route";
import { verifyAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Project } from "@/types";
import { Skeleton } from "../ui/skeleton";
import { API_URL } from "@/lib/config";
import React from "react";

export function NavCurrentProject() {
  const router = useRouter();
  const projectSnapshot = useSnapshot(projectStore);
  const userSnapshot = useSnapshot(userStore);

  // Prevent multiple simultaneous initializations
  const initializingRef = useRef(false);
  const creatingProjectRef = useRef(false);

  const createAndSetCurrentProject = useCallback(
    async (title: string) => {
      // Prevent multiple project creation calls
      if (creatingProjectRef.current) {
        return null;
      }

      creatingProjectRef.current = true;

      try {
        const response = await createProject(title);

        if (response.ok) {
          const project = await response.json();
          projectStore.project = project;

          // Update localStorage with new current project
          localStorage.setItem(
            "currentProject",
            JSON.stringify({
              id: project._id,
              userId: userSnapshot.user?._id,
            })
          );

          return project;
        } else {
          console.error("Failed to create project:", response.statusText);
          return null;
        }
      } catch (error) {
        console.error("Error creating project:", error);
        return null;
      } finally {
        creatingProjectRef.current = false;
      }
    },
    [userSnapshot.user?._id]
  );

  const fetchAndSetCurrentProject = useCallback(async (projectId: string) => {
    try {
      const response = await getProject(projectId);

      if (response.ok) {
        const project = await response.json();
        projectStore.project = project;
        return project;
      } else {
        console.warn(
          "Failed to fetch project, falling back to first user project"
        );
        // Clear invalid project from localStorage
        localStorage.removeItem("currentProject");
        return null;
      }
    } catch (error) {
      console.error("Error fetching project:", error);
      localStorage.removeItem("currentProject");
      return null;
    }
  }, []);

  const fetchAndSetFirstUserProject = useCallback(async () => {
    try {
      const payload = await verifyAuth();

      if (!payload) {
        router.push("/auth/login");
        return null;
      }

      const response = await getUserProjects((payload as { id: string }).id);

      if (response.ok) {
        const projects: Project[] = await response.json();

        if (projects.length > 0) {
          projectStore.project = projects[0];

          // Update localStorage with current project
          localStorage.setItem(
            "currentProject",
            JSON.stringify({
              id: projects[0]._id,
              userId: userSnapshot.user?._id,
            })
          );

          return projects[0];
        } else {
          // Only create project if no projects exist
          const newProject = await createAndSetCurrentProject(
            `проект ${userSnapshot.user?.username}`
          );
          return newProject;
        }
      } else {
        console.error("Failed to fetch user projects:", response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Error fetching user projects:", error);
      return null;
    }
  }, [
    userSnapshot.user?.username,
    userSnapshot.user?._id,
    router,
    createAndSetCurrentProject,
  ]);

  const initializeProject = useCallback(async () => {
    if (
      !userSnapshot.user ||
      initializingRef.current ||
      projectSnapshot.project
    ) {
      return;
    }

    initializingRef.current = true;

    try {
      // Get current project from localStorage
      const currentProjectStr = localStorage.getItem("currentProject");
      let currentProject = null;

      try {
        currentProject = currentProjectStr
          ? JSON.parse(currentProjectStr)
          : null;
      } catch (error) {
        console.warn("Invalid currentProject in localStorage, removing it");
        localStorage.removeItem("currentProject");
      }

      // Check if stored project is valid and belongs to current user
      if (
        currentProject &&
        currentProject.id &&
        currentProject.userId === userSnapshot.user._id
      ) {
        const project = await fetchAndSetCurrentProject(currentProject.id);

        // If fetching failed, fall back to first user project
        if (!project) {
          await fetchAndSetFirstUserProject();
        }
      } else {
        // No valid stored project, get first user project or create one
        await fetchAndSetFirstUserProject();
      }
    } catch (error) {
      console.error("Error initializing project:", error);
    } finally {
      initializingRef.current = false;
    }
  }, [
    userSnapshot.user,
    projectSnapshot.project,
    fetchAndSetCurrentProject,
    fetchAndSetFirstUserProject,
  ]);

  // Initialize project when user changes
  useEffect(() => {
    initializeProject();
  }, [initializeProject]);

  // Update user role when project or user changes
  useEffect(() => {
    if (!projectSnapshot.project || !userSnapshot.user) return;

    const userRole = projectSnapshot.project.users?.find(
      (user) => user.userId._id === userSnapshot.user?._id
    )?.role;

    projectStore.userRole = userRole ?? "undefined";
  }, [projectSnapshot.project, userSnapshot.user]);

  if (!projectSnapshot.project) {
    return <Skeleton className="w-60 h-12" />;
  }

  return (
    <div className="flex items-center gap-2">
      <Avatar className="rounded-lg">
        <AvatarImage src={`${API_URL}${projectSnapshot.project.imageUrl}`} />
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
