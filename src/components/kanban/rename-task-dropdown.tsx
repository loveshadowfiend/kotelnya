import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "../ui/input";
import { boardStore } from "@/stores/board-store";
import { useSnapshot } from "valtio";
import { useState } from "react";

interface KanbanRenameTaskDropdownProps {
  children: React.ReactNode;
  taskId: string;
  taskTitle: string;
}

export function KanbanRenameTaskDropdown({
  children,
  taskId,
  taskTitle,
}: KanbanRenameTaskDropdownProps) {
  const [initialName, setInitialName] = useState(taskTitle);
  const boardSnapshot = useSnapshot(boardStore);

  return (
    <DropdownMenu dir="ltr">
      <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-72" side="bottom" align="start">
        <Input
          placeholder={initialName}
          onChange={(e) => {
            if (e.target.value.trim() === "") {
              boardStore.tasks[taskId].title = initialName;
              return;
            }

            boardStore.tasks[taskId].title = e.target.value;
          }}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
