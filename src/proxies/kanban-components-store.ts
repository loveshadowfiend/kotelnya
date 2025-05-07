import { proxy } from "valtio";
import { KanbanComponentsState } from "@/types";

export const kanbanComponentsStore = proxy<KanbanComponentsState>({
  boardId: "",
  isAddingTask: false,
  isAddingCategory: false,
  addNewTaskActiveColumn: "",
  renamingColumn: "",
});
