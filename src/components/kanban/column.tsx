"use client";

import { Draggable, Droppable } from "@hello-pangea/dnd";
import { KanbanItem } from "@/components/kanban/item";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KanbanAddTask } from "./add-task";
import { Column, Task } from "@/types";
import { Badge } from "../ui/badge";
import { kanbanComponentsStore } from "@/stores/kanban-components-store";
import { useSnapshot } from "valtio";
import { KanbanRenameColumn } from "./rename-column";
import { Ellipsis } from "lucide-react";
import { ColumnDropdown } from "./column-dropdown";
import { Button } from "../ui/button";

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  index: number;
}

export function KanbanColumn({ column, tasks, index }: KanbanColumnProps) {
  const kanbanComponentsSnapshot = useSnapshot(kanbanComponentsStore);

  return (
    <Draggable draggableId={column._id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="
          h-fit w-[var(--kanban-column-w)]
          lg:w-[var(--kanban-column-w-lg)]
          "
        >
          <Card className="h-full py-0 pb-6" {...provided.dragHandleProps}>
            <CardHeader className="flex flex-row items-center justify-between cursor-grab pt-6">
              <CardTitle className="text-lg cursor-pointer flex items-center gap-2">
                {kanbanComponentsSnapshot.renamingColumn !== column._id && (
                  <Badge
                    className="text-sm rounded-full"
                    onClick={() => {
                      kanbanComponentsStore.renamingColumn = column._id;
                    }}
                  >
                    {column.title}
                  </Badge>
                )}
                {kanbanComponentsSnapshot.renamingColumn === column._id && (
                  <KanbanRenameColumn columnId={column._id} />
                )}
              </CardTitle>
              {kanbanComponentsSnapshot.renamingColumn !== column._id && (
                <ColumnDropdown
                  columnTitle={column.title}
                  columnId={column._id}
                >
                  <Button variant="ghost">
                    <Ellipsis className="w-5 h-5 cursor-pointer" />
                  </Button>
                </ColumnDropdown>
              )}
            </CardHeader>
            <Droppable droppableId={column._id} type="task">
              {(provided) => (
                <CardContent
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`transition-colors gap-3 px-3`}
                >
                  {tasks.map((task, index) => (
                    <KanbanItem
                      key={task._id}
                      task={task}
                      column={column}
                      index={index}
                    />
                  ))}
                  {provided.placeholder}
                  <KanbanAddTask column={column} />
                </CardContent>
              )}
            </Droppable>
          </Card>
        </div>
      )}
    </Draggable>
  );
}
