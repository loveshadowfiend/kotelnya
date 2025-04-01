"use client";

import { useState } from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { MoreHorizontal, Plus, Trash2 } from "lucide-react";

import { KanbanItem } from "@/components/kanban/item";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteColumn } from "@/proxies/kanbanBoardStore";
import { KanbanNewTask } from "./new-task";
import { KanbanTask } from "@/types";
import { Badge } from "../ui/badge";
import { kanbanComponentsStore } from "@/proxies/kanbanComponentsStore";
import { useSnapshot } from "valtio";
import { ka } from "date-fns/locale";
import { Input } from "../ui/input";

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
  const kanbanComponentsSnapshot = useSnapshot(kanbanComponentsStore);

  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="
          h-fit w-[var(--kanban-column-w)]
          lg:w-[var(--kanban-column-w-lg)]
          "
        >
          <Card className="h-full">
            <CardHeader
              {...provided.dragHandleProps}
              className="flex flex-row items-center justify-between cursor-grab"
            >
              <CardTitle className="text-lg">
                {kanbanComponentsSnapshot.renamingColumn !== column.id && (
                  <Badge
                    className="text-sm rounded-full"
                    onClick={() => {
                      kanbanComponentsStore.renamingColumn = column.id;
                    }}
                  >
                    {column.title}
                  </Badge>
                )}
                {kanbanComponentsSnapshot.renamingColumn === column.id && (
                  <Input
                    className="rounded-full"
                    type="text"
                    value={column.title}
                    onChange={(e) => {
                      column.title = e.target.value;
                    }}
                  />
                )}
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
