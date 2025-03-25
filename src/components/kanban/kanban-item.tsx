"use client";

import { Draggable } from "@hello-pangea/dnd";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { KanbanCard } from "./kanban-card";
import { KanbanColumn, KanbanTask } from "@/types";

interface KanbanItemProps {
  task: KanbanTask;
  column: KanbanColumn;
  index: number;
}

export function KanbanItem({ task, column, index }: KanbanItemProps) {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  return (
    <>
      <Draggable draggableId={task.id} index={index}>
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
            </CardHeader>
          </Card>
        )}
      </Draggable>
      <KanbanCard
        taskId={task.id}
        columnId={column.id}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />
    </>
  );
}
