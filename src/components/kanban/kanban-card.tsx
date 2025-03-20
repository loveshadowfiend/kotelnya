import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { deleteTask } from "@/proxies/kanbanBoardStore";

interface KanbanCardProps {
  taskId: string;
  columnId: string;
  isDialogOpen: boolean;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
}

export function KanbanCard({
  taskId,
  columnId,
  isDialogOpen,
  setIsDialogOpen,
}: KanbanCardProps) {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            hi
            <Trash2
              className="hover:text-red-500 cursor-pointer"
              width={16}
              height={16}
              onClick={() => deleteTask(columnId, taskId)}
            />
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
