import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Dispatch, SetStateAction, useRef } from "react";
import { getAllColumnTitlesAndIds, boardStore } from "@/stores/board-store";
import { useSnapshot } from "valtio";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { BadgeDropdown } from "./badge-dropdown";
import { DatePicker } from "./date-picker";
import { updateTask } from "@/api/tasks/route";
import { KanbanRenameTaskDropdown } from "./rename-task-dropdown";
import { useMediaQuery } from "react-responsive";
import { AssigneeSelect } from "./assignee-select";
import { Button } from "../ui/button";

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
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return (
    <Drawer
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      direction={isTabletOrMobile ? "bottom" : "right"}
    >
      <DrawerContent>
        <DrawerHeader>
          <KanbanRenameTaskDropdown
            taskId={taskId}
            taskTitle={boardSnapshot.tasks[taskId].title}
          >
            <DialogTitle className="w-full flex items-center gap-3 field-sizing-content hover:cursor-pointer">
              {boardSnapshot.tasks[taskId].title}{" "}
            </DialogTitle>
            <BadgeDropdown
              className="my-3"
              currentColumndId={columnId}
              taskId={taskId}
              title={boardSnapshot.columns[columnId].title}
              items={getAllColumnTitlesAndIds()}
            />
          </KanbanRenameTaskDropdown>
        </DrawerHeader>
        <div className="grid gap-6 mx-4 mb-4">
          <div className="grid gap-3">
            <Label htmlFor="deadline">дедлайн</Label>
            <DatePicker className="w-full" taskId={taskId} />
          </div>
          <div className="grid gap-3">
            <Label className="group flex justify-between" htmlFor="description">
              описание
            </Label>
            <Textarea
              className="resize-none mb-3 field-sizing-content"
              id="description"
              placeholder="описание задачи"
              defaultValue={boardSnapshot.tasks[taskId].description}
              onChange={(e) => {
                boardStore.tasks[taskId].description = e.target.value;

                if (timeoutRef.current) {
                  clearTimeout(timeoutRef.current);
                }

                timeoutRef.current = setTimeout(() => {
                  updateTask(taskId, {
                    description: e.target.value,
                  });
                }, 1000);
              }}
            />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
