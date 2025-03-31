"use client";

import { useState } from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { MoreHorizontal, Plus, Trash2 } from "lucide-react";

import { KanbanItem } from "@/components/kanban/kanban-item";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteColumn } from "@/proxies/kanbanBoardStore";
import { KanbanNewTask } from "./kanban-new-task";
import { KanbanTask } from "@/types";
import { Badge } from "../ui/badge";

interface KanbanColumnProps {
  column: {
    id: string;
    title: string;
    taskIds: readonly string[];
  };
  tasks: KanbanTask[];
  index: number;
}

export function KanbanColumn({ column, tasks, index }: KanbanColumnProps) {
  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="h-fit w-[80vw] lg:w-[20vw]"
        >
          <Card className="h-full">
            <CardHeader
              {...provided.dragHandleProps}
              className="flex flex-row items-center justify-between cursor-grab"
            >
              <CardTitle className="text-lg">
                <Badge className="text-sm rounded-full">{column.title}</Badge>
              </CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Действие над столбцом</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => deleteColumn(column.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Удалить
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <Droppable droppableId={column.id} type="task">
              {(provided) => (
                <CardContent
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`transition-colors gap-3`}
                >
                  {tasks.map((task, index) => (
                    <KanbanItem
                      key={task.id}
                      task={task}
                      column={column}
                      index={index}
                    />
                  ))}
                  {provided.placeholder}
                  <KanbanNewTask column={column} />
                </CardContent>
              )}
            </Droppable>
          </Card>
        </div>
      )}
    </Draggable>
  );
}
