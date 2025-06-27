import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { boardStore } from "@/stores/board-store";
import { useSnapshot } from "valtio";
import { cn } from "@/lib/utils";
import { updateTask } from "@/api/tasks/route";

interface AssigneeSelectProps {
  taskId: string;
  className?: string;
}

export function AssigneeSelect({ taskId, className }: AssigneeSelectProps) {
  const boardSnapshot = useSnapshot(boardStore);

  return (
    <Select
      value={
        boardStore.tasks[taskId].assignee[0]
          ? boardStore.tasks[taskId].assignee[0]._id
          : "none"
      }
      onValueChange={(value) => {
        if (value === "none") {
          boardStore.tasks[taskId].assignee = [];

          updateTask(taskId, {
            assignee: [],
          });

          return;
        }

        boardStore.tasks[taskId].assignee[0] = {
          ...boardStore.projectUsers[value],
        };

        updateTask(taskId, {
          assignee: [boardStore.projectUsers[value]],
        });
      }}
    >
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder="" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="none">не выбрано</SelectItem>
        {Object.values(boardStore.projectUsers).map((user) => (
          <SelectItem className="flex gap-3" key={user._id} value={user._id}>
            <span>{user.username}</span>
            <span className="text-muted-foreground truncate">{user.email}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
