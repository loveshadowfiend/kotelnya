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
import { boardStore } from "@/stores/board-store";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { SidebarRenameForm } from "./rename-form";
import { useState } from "react";

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
  const [isRenaming, setIsRenaming] = useState<boolean>(false);
  const params = useParams();
  const router = useRouter();
  const boardsSnapshot = useSnapshot(boardsStore);

  async function handleDeleteBoard() {
    if (params && params.boardId && params.boardId === boardId) {
      router.push("/");
    }

    await deleteBoard(boardId);

    if (boardsStore.error) {
      toast.error(`возникла ошибка: ${boardsStore.error}`);
    } else {
      toast.success(`доска ${boardTitle} успешно удалена`);
    }
  }

  return (
    <DropdownMenu
      onOpenChange={(open: boolean) => {
        if (!open) {
          setIsRenaming(false);
        }
      }}
    >
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="shadow-none w-60">
        <DropdownMenuLabel className="text-sm font-normal">
          {boardTitle}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {!isRenaming && (
          <>
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault();
                setIsRenaming(true);
              }}
            >
              <Edit />
              переименовать
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={handleDeleteBoard}
            >
              <Trash2 className="text-destructive" />
              <span>удалить</span>
            </DropdownMenuItem>
          </>
        )}
        {isRenaming && (
          <SidebarRenameForm
            boardId={boardId}
            title={boardTitle}
            setIsRenaming={setIsRenaming}
          />
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
