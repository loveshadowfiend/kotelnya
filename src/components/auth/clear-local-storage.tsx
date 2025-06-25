"use client";

import { projectStore } from "@/stores/project-store";
import { projectsStore } from "@/stores/projects-store";
import { userStore } from "@/stores/user-store";
import { useEffect } from "react";

export function ClearLocalStorage() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("currentProject");
    }

    userStore.user = null;
    projectsStore.projects = null;
    projectStore.project = null;
  }, []);

  return null;
}
