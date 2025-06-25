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
import { Edit, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";

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
        <DropdownMenuItem onClick={handleDeleteColumn}>
          <Trash2 />
          удалить
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
