"use client";

import { Draggable, Droppable } from "@hello-pangea/dnd";
import { KanbanItem } from "@/components/kanban/item";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KanbanNewTask } from "./new-task";
import { KanbanTask } from "@/types";
import { Badge } from "../ui/badge";
import { kanbanComponentsStore } from "@/proxies/kanban-components-store";
import { useSnapshot } from "valtio";
import { KanbanRenameColumn } from "./rename-column";
import { GripVertical } from "lucide-react";

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
          <Card className="h-full py-0 pb-6">
            <CardHeader
              {...provided.dragHandleProps}
              className="flex flex-row items-center justify-between cursor-grab pt-6"
            >
              <CardTitle className="text-lg cursor-pointer">
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
                  <KanbanRenameColumn columnId={column.id} />
                )}
              </CardTitle>
              {kanbanComponentsSnapshot.renamingColumn !== column.id && (
                <GripVertical className="text-muted-foreground" />
              )}
            </CardHeader>
            <Droppable droppableId={column.id} type="task">
              {(provided) => (
                <CardContent
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`transition-colors gap-3 px-3`}
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
