"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, Trash2 } from "lucide-react";
import { deleteTask as deleteTaskStore } from "@/stores/board-store";
import { deleteTask as deleteTaskApi } from "@/api/tasks/route";
import { toast } from "sonner";
import { kanbanComponentsStore } from "@/stores/kanban-components-store";

interface NoteDropdownProps {
  children: React.ReactNode;
  columnId: string;
  taskId: string;
  taskTitle: string;
}

export function TaskDropdown({
  children,
  columnId,
  taskId,
  taskTitle,
}: NoteDropdownProps) {
  async function handleDeleteTask() {
    toast.promise(deleteTaskApi(taskId), {
      loading: "удаление задачи...",
      success: () => {
        deleteTaskStore(columnId, taskId);

        return `задача "${taskTitle}" успешно удалена`;
      },
      error: "не удалось удалить задачу",
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="shadow-none w-[240px]">
        <DropdownMenuLabel className="text-sm font-normal">
          {taskTitle}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            kanbanComponentsStore.renamingTask = taskId;
          }}
        >
          <Edit />
          переименовать
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteTask();
          }}
        >
          <Trash2 className="text-destructive" />
          <span>удалить</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
