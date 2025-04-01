import { proxy } from "valtio";
import { KanbanComponentsState } from "@/types";

export const kanbanComponentsStore = proxy<KanbanComponentsState>({
  isAddingTask: false,
  isAddingCategory: false,
  addNewTaskActiveColumn: "",
  renamingColumn: "",
});
