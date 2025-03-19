"use client";

import { Draggable } from "@hello-pangea/dnd";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface KanbanCardProps {
  task: {
    id: string;
    title: string;
    description: string;
  };
  index: number;
  onDelete: () => void;
}

export function KanbanCard({ task, index, onDelete }: KanbanCardProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`cursor-grab mb-3 ${
            snapshot.isDragging ? "shadow-lg" : ""
          }`}
        >
          {/* <CardContent className="flex justify-between items-center">
            <p className="text-sm">{task.title}</p>
          </CardContent> */}
          <CardHeader>
            <CardTitle className="text-sm font-normal">{task.title}</CardTitle>
            <CardDescription>{task.description}</CardDescription>
          </CardHeader>
        </Card>
      )}
    </Draggable>
  );
}
