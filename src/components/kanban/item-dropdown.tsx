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

export function ItemDropdown({
  children,
  columnId,
  taskId,
  taskTitle,
}: NoteDropdownProps) {
  async function handleDeleteTask() {
    toast.promise(deleteTaskApi(taskId), {
      loading: "Удаление задачи...",
      success: () => {
        deleteTaskStore(columnId, taskId);

        return `Задача "${taskTitle}" успешно удалена`;
      },
      error: "Не удалось удалить задачу",
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
          Переименовать
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteTask();
          }}
        >
          <Trash2 />
          <span>Удалить</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
