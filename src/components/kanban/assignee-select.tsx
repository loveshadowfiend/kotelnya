import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { boardStore } from "@/stores/board-store";
import { useSnapshot } from "valtio";
import { mockUsers } from "@/constants";
import { cn } from "@/lib/utils";

interface AssigneeSelectProps {
  taskId: string;
  className?: string;
}

export function AssigneeSelect({ taskId, className }: AssigneeSelectProps) {
  const kanbanBoardSnapshot = useSnapshot(boardStore);

  return (
    <Select
      value={kanbanBoardSnapshot.tasks[taskId].assignee}
      onValueChange={(value) => {
        boardStore.tasks[taskId].assignee = value;
      }}
    >
      <SelectTrigger className={cn("w-full", className)}>
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
  );
}
