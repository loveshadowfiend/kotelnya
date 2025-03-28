import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Dispatch, SetStateAction, useEffect } from "react";
import {
  getAllColumnTitlesAndIds,
  kanbanBoardStore,
} from "@/proxies/kanbanBoardStore";
import { useSnapshot } from "valtio";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { BadgeDropdown } from "../badge-dropdown";
import { mockUsers } from "@/constants";

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
            <Select
              value={kanbanBoardSnapshot.tasks[taskId].assignee}
              onValueChange={(value) => {
                kanbanBoardStore.tasks[taskId].assignee = value;
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(mockUsers).map((user) => (
                  <SelectItem key={user.id} value={user.name}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
