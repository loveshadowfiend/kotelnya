import { proxy } from "valtio";
import { KanbanStore } from "@/types";

export const kanbanStore = proxy<KanbanStore>({
  isAddingTask: false,
  isAddingCategory: false,
});
