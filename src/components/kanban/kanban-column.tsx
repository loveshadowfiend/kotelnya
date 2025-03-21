"use client";

import { useState } from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { MoreHorizontal, Plus, Trash2 } from "lucide-react";

import { KanbanItem } from "@/components/kanban/kanban-item";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addNewTask, deleteColumn } from "@/proxies/kanbanBoardStore";
import { KanbanNewTask } from "./kanban-new-task";

interface KanbanColumnProps {
  column: {
    id: string;
    title: string;
    taskIds: readonly string[];
  };
  tasks: {
    id: string;
    title: string;
    description: string;
  }[];
  index: number;
}

export function KanbanColumn({ column, tasks, index }: KanbanColumnProps) {
  const [newTaskContent, setNewTaskContent] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddTask = () => {
    if (!newTaskContent.trim()) return;
    addNewTask(column.id, newTaskContent);
    setNewTaskContent("");
    setIsDialogOpen(false);
  };

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
              <CardTitle className="text-lg">{column.title}</CardTitle>
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
                  <KanbanNewTask
                    column={column}
                    isDialogOpen={isDialogOpen}
                    setIsDialogOpen={setIsDialogOpen}
                  />
                </CardContent>
              )}
            </Droppable>
          </Card>
        </div>
      )}
    </Draggable>
  );
}
