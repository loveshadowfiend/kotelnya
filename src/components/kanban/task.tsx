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
import { TaskDropdown } from "./task-dropdown";
import { Button } from "../ui/button";
import { Ellipsis } from "lucide-react";
import { KanbanRenameTaskForm } from "./rename-task-form";
import { useSnapshot } from "valtio";
import { kanbanComponentsStore } from "@/stores/kanban-components-store";
import { API_URL } from "@/lib/config";

interface KanbanItemProps {
  task: Task;
  column: Column;
  index: number;
}

export function KanbanTask({ task, column, index }: KanbanItemProps) {
  const kanbanComponentsSnapshot = useSnapshot(kanbanComponentsStore);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  return (
    <>
      {kanbanComponentsSnapshot.renamingTask === task._id && (
        <KanbanRenameTaskForm task={task} />
      )}
      {kanbanComponentsSnapshot.renamingTask !== task._id && (
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
                  <CardTitle className="flex justify-between items-center text-sm font-normal">
                    <span>{task.title}</span>
                    <TaskDropdown
                      columnId={column._id}
                      taskId={task._id}
                      taskTitle={task.title}
                    >
                      <Button
                        className="text-muted-foreground w-4 h-4"
                        variant="ghost"
                      >
                        <Ellipsis />
                      </Button>
                    </TaskDropdown>
                  </CardTitle>
                  {Array.isArray(task.assignee) && task.assignee.length > 0 && (
                    <CardDescription className="flex items-center gap-2 mt-2">
                      {task.assignee.map((assignee) => (
                        <div
                          key={assignee._id}
                          className="flex items-center gap-2"
                        >
                          <Avatar className="w-6 h-6 flex items-center">
                            <AvatarImage
                              src={`${API_URL}${assignee.avatarUrl}`}
                              alt={assignee.username}
                            />
                            <AvatarFallback className="text-xs">
                              {assignee.username
                                ? assignee.username.slice(0, 2)
                                : ""}
                            </AvatarFallback>
                          </Avatar>
                          <span>{assignee.username}</span>
                        </div>
                      ))}
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
      )}
    </>
  );
}
