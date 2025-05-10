"use client";

import { boardsStore, deleteBoard } from "@/stores/boards-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSnapshot } from "valtio";
import { Edit, Trash2 } from "lucide-react";

interface BoardDropdownProps {
  children: React.ReactNode;
  boardId: string;
  boardTitle: string;
}

export function BoardDropdown({
  children,
  boardId,
  boardTitle,
}: BoardDropdownProps) {
  const boardSnapshot = useSnapshot(boardsStore);

  async function handleDeleteBoard() {
    deleteBoard(boardId);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="shadow-none w-[240px]">
        <DropdownMenuLabel className="text-sm font-normal">
          {boardTitle}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Edit />
          Переименовать
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDeleteBoard}>
          <Trash2 />
          <span>Удалить</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
