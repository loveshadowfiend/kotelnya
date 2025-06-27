"use client";

import { deleteColumn as deleteColumnApi } from "@/api/columns/route";
import { deleteColumn as deleteColumnStore } from "@/stores/board-store";
import { kanbanComponentsStore } from "@/stores/kanban-components-store";
import { useSnapshot } from "valtio/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ColumnDropdownProps {
  children: React.ReactNode;
  columnTitle: string;
  columnId: string;
}

export function ColumnDropdown({
  children,
  columnTitle,
  columnId,
}: ColumnDropdownProps) {
  const kanbanComponentsSnapshop = useSnapshot(kanbanComponentsStore);

  async function handleDeleteColumn() {
    toast.promise(deleteColumnApi(columnId), {
      loading: "удаление списка...",
      success: () => {
        deleteColumnStore(columnId);

        return `список "${columnTitle}" успешно удален`;
      },
      error: "не удалось удалить список",
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{columnTitle}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => (kanbanComponentsStore.renamingColumn = columnId)}
        >
          <Edit />
          переименовать
        </DropdownMenuItem>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem
              className="text-destructive"
              onSelect={(e) => e.preventDefault()}
            >
              <Trash2 className="text-destructive" />
              удалить
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                вы действительно хотите удалить список?
              </AlertDialogTitle>
              <AlertDialogDescription>
                это действие нельзя будет отменить, и все задачи в этом списке
                будут удалены
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>отменить</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive"
                onClick={handleDeleteColumn}
              >
                продолжить
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
