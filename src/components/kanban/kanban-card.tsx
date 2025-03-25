import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { deleteTask, kanbanBoardStore } from "@/proxies/kanbanBoardStore";
import { useSnapshot } from "valtio";

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
  const kanbanBoardSnapshot = useSnapshot(kanbanBoardStore);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            {kanbanBoardSnapshot.tasks[taskId].title}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div>{kanbanBoardSnapshot.tasks[taskId].description}</div>
      </DialogContent>
    </Dialog>
  );
}
