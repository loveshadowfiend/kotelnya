import { ProjectState } from "@/types";
import { proxy } from "valtio";

export const projectStore = proxy<ProjectState>();
