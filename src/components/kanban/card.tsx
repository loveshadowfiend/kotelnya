import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Dispatch, SetStateAction } from "react";
import {
  getAllColumnTitlesAndIds,
  kanbanBoardStore,
} from "@/proxies/kanban-board-store";
import { useSnapshot } from "valtio";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { BadgeDropdown } from "../badge-dropdown";
import { AssigneeSelect } from "./assignee-select";
import { DatePicker } from "./date-picker";

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
          <DialogTitle className="flex items-center gap-3 field-sizing-content">
            {kanbanBoardSnapshot.tasks[taskId].title}
          </DialogTitle>
          <DialogDescription>
            <BadgeDropdown
              className="my-2"
              currentColumndId={columnId}
              taskId={taskId}
              title={kanbanBoardSnapshot.columns[columnId].title}
              items={getAllColumnTitlesAndIds()}
            />
          </DialogDescription>
          <div className="grid gap-3">
            <Label htmlFor="assignee">Исполнитель</Label>
            <AssigneeSelect taskId={taskId} />
            <Label htmlFor="description">Описание</Label>
            <Textarea
              className="resize-none mb-3 field-sizing-content"
              id="description"
              placeholder="Описание задачи"
              value={kanbanBoardSnapshot.tasks[taskId].description}
              onChange={(e) => {
                kanbanBoardStore.tasks[taskId].description = e.target.value;
              }}
            />
            <Label htmlFor="deadline">Дедлайн</Label>
            <DatePicker className="w-full" taskId={taskId} />
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
