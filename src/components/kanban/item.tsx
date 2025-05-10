"use client";

import { Draggable } from "@hello-pangea/dnd";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { KanbanCard } from "./card";
import { Column, Task } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface KanbanItemProps {
  task: Task;
  column: Column;
  index: number;
}

export function KanbanItem({ task, column, index }: KanbanItemProps) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  return (
    <>
      <Draggable draggableId={task._id} index={index}>
        {(provided, snapshot) => (
          <Card
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`cursor-pointer mb-3 hover:bg-muted ${
              snapshot.isDragging ? "cursor-grab shadow-sm bg-muted" : ""
            }`}
            onClick={() => setIsDialogOpen(true)}
          >
            <CardHeader>
              <CardTitle className="text-sm font-normal">
                {task.title}
              </CardTitle>
              {task.assignee.length > 0 && (
                <CardDescription className="flex items-center gap-2 mt-2">
                  <Avatar className="w-6 h-6 flex items-center">
                    <AvatarImage />
                    <AvatarFallback className="text-xs">NN</AvatarFallback>
                  </Avatar>
                  <span>{task.assignee}</span>
                </CardDescription>
              )}
            </CardHeader>
          </Card>
        )}
      </Draggable>
      <KanbanCard
        taskId={task._id}
        columnId={column._id}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />
    </>
  );
}
