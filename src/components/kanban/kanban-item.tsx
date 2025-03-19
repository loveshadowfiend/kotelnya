"use client";

import { Draggable } from "@hello-pangea/dnd";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { KanbanCard } from "./kanban-card";

interface KanbanItemProps {
  task: {
    id: string;
    title: string;
    description: string;
  };
  index: number;
  onDelete: () => void;
}

export function KanbanItem({ task, index, onDelete }: KanbanItemProps) {
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
              snapshot.isDragging ? "cursor-grab shadow-lg" : ""
            }`}
            onClick={() => setIsDialogOpen(true)}
          >
            <CardHeader>
              <CardTitle className="text-sm font-normal">
                {task.title}
              </CardTitle>
              <CardDescription>{task.description}</CardDescription>
            </CardHeader>
          </Card>
        )}
      </Draggable>
      <KanbanCard
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />
    </>
  );
}
