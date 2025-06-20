"use client";

import { getBoards } from "@/api/boards/route";
import { getNotes } from "@/api/notes/routes";
import { createProject, getProject } from "@/api/projects/route";
import { getUser, getUserProjects } from "@/api/users/route";
import { useIsMobile } from "@/hooks/use-mobile";
import { verifyAuth } from "@/lib/auth";
import { boardsStore } from "@/stores/boards-store";
import { notesStore } from "@/stores/notes-store";
import { projectStore } from "@/stores/project-store";
import { userStore } from "@/stores/user-store";
import { Project } from "@/types";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useSnapshot } from "valtio";

export function MobileProvider() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const userSnapshot = useSnapshot(userStore);
  const projectSnapshot = useSnapshot(projectStore);
  const notesSnapshot = useSnapshot(notesStore);
  const boardsSnapshot = useSnapshot(boardsStore);

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
            `Проект ${userSnapshot.user?.username}`
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

  useEffect(() => {
    if (!isMobile) return;

    async function fetchAndSetUser() {
      userStore.loading = true;

      const payload = await verifyAuth();

      if (!payload) {
        router.push("/auth/login");

        return;
      }

      const response = await getUser((payload as { id: string }).id);

      if (response.ok) {
        const user = await response.json();
        userStore.user = user;
      }

      userStore.loading = false;
    }

    fetchAndSetUser();
  }, []);

  useEffect(() => {
    if (!projectSnapshot.project) return;

    async function fetchBoards() {
      boardsStore.loading = true;

      const response = await getBoards(projectSnapshot.project!._id);

      if (response.ok) {
        const data = await response.json();
        boardsStore.boards = data;
      } else {
        toast.error(
          "не удалось загрузить доски. пожалуйста, попробуйте позже."
        );
      }

      boardsStore.loading = false;
    }

    fetchBoards();
  }, [projectSnapshot]);

  useEffect(() => {
    if (!projectSnapshot.project) return;

    async function fetchNotes() {
      notesStore.loading = true;

      const response = await getNotes(projectSnapshot.project!._id);

      if (response.ok) {
        const data = await response.json();
        notesStore.notes = data;
      } else {
        toast.error(
          "не удалось загрузить заметки. Пожалуйста, попробуйте позже."
        );
      }

      notesStore.loading = false;
    }

    fetchNotes();
  }, [projectSnapshot]);

  useEffect(() => {
    if (!isMobile) return;

    initializeProject();
  }, [initializeProject]);

  return null;
}
