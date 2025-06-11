import { proxy } from "valtio";
import { ProjectsState } from "@/types";
import {
  createProject,
  deleteProject as deleteProjectApi,
} from "@/api/projects/route";

export async function deleteProject(projectId: string) {
  projectsStore.loading = true;

  const response = await deleteProjectApi(projectId);

  if (response.ok) {
    const newProjects =
      projectsStore.projects?.filter((project) => project._id !== projectId) ??
      null;

    projectsStore.projects = newProjects;
  } else {
    projectsStore.error = response.statusText;
  }

  projectsStore.loading = false;
}

export async function addProject(title: string, status?: string) {
  projectsStore.loading = true;

  const response = await createProject(title, status);

  if (response.ok) {
    const newProject = await response.json();

    projectsStore.projects?.push(newProject);
  } else {
    projectsStore.error = response.statusText;
  }

  projectsStore.loading = false;
}

export const projectsStore = proxy<ProjectsState>({
  projects: null,
  loading: true,
  error: null,
});
