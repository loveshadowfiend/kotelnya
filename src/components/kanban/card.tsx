import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Dispatch, SetStateAction, useRef } from "react";
import { getAllColumnTitlesAndIds, boardStore } from "@/stores/board-store";
import { useSnapshot } from "valtio";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { BadgeDropdown } from "../badge-dropdown";
import { DatePicker } from "./date-picker";
import { updateTask } from "@/api/tasks/route";

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
  const boardSnapshot = useSnapshot(boardStore);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  console.log("card: ", boardSnapshot.tasks);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 field-sizing-content">
            {boardSnapshot.tasks[taskId].title}
          </DialogTitle>
          <DialogDescription>
            <BadgeDropdown
              className="my-2"
              currentColumndId={columnId}
              taskId={taskId}
              title={boardSnapshot.columns[columnId].title}
              items={getAllColumnTitlesAndIds()}
            />
          </DialogDescription>
          <div className="grid gap-3">
            {/* <Label htmlFor="assignee">Исполнитель</Label>
            <AssigneeSelect taskId={taskId} /> */}
            <Label htmlFor="description">Описание</Label>
            <Textarea
              className="resize-none mb-3 field-sizing-content"
              id="description"
              placeholder="Описание задачи"
              defaultValue={boardSnapshot.tasks[taskId].description}
              onChange={(e) => {
                boardStore.tasks[taskId].description = e.target.value;

                if (timeoutRef.current) {
                  clearTimeout(timeoutRef.current);
                }

                timeoutRef.current = setTimeout(() => {
                  updateTask(
                    taskId,
                    boardSnapshot.tasks[taskId].title,
                    e.target.value
                  );
                }, 1000);
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
