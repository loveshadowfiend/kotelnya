"use client";
import { ChevronDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { boardStore, moveTask } from "@/stores/board-store";
import { useSnapshot } from "valtio";

interface BadgeDropdownProps {
  className?: string;
  currentColumndId: string;
  taskId: string;
  title: string;
  items: {
    id: string;
    title: string;
  }[];
  variant?: "default" | "secondary" | "outline" | "destructive";
}

export function BadgeDropdown({
  className,
  currentColumndId,
  taskId,
  title,
  items,
  variant = "default",
}: BadgeDropdownProps) {
  const boardSnapshot = useSnapshot(boardStore);
  const boardId = boardSnapshot._id;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Badge
          variant={variant}
          className={cn("cursor-pointer flex items-center gap-1", className)}
        >
          {title}
          <ChevronDown className="h-3 w-3" />
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {items.map((item, index) => (
          <DropdownMenuItem
            key={index}
            onClick={(e) => {
              moveTask(boardId, currentColumndId, item.id, taskId, 0);
            }}
          >
            {item.title}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
