import { Save } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { kanbanBoardStore } from "@/proxies/kanban-board-store";
import { kanbanComponentsStore } from "@/proxies/kanban-components-store";

interface KanbanRenameColumnProps {
  columnId: string;
}

export function KanbanRenameColumn({ columnId }: KanbanRenameColumnProps) {
  return (
    <div className="flex justify-between w-full">
      <Input
        className="rounded-full"
        type="text"
        defaultValue={kanbanBoardStore.columns[columnId].title}
        onChange={(e) => {
          kanbanBoardStore.columns[columnId].title = e.target.value;
        }}
      />
      <Button
        type="submit"
        variant="ghost"
        onClick={() => {
          kanbanBoardStore.columns[columnId].title =
            kanbanBoardStore.columns[columnId].title;
          kanbanComponentsStore.renamingColumn = "";
        }}
      >
        <Save />
      </Button>
    </div>
  );
}
