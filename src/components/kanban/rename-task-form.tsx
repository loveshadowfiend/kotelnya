import { boardStore } from "@/stores/board-store";
import { useSnapshot } from "valtio";

interface KanbanRenameTaskProps {
  taskId: string;
}

export function KanbanRenameTaskForm({ taskId }: KanbanRenameTaskProps) {
  const boardSnapshot = useSnapshot(boardStore);
}
