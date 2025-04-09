"use client";

import { DragDropContext, Droppable, type DropResult } from "@hello-pangea/dnd";
import { KanbanColumn } from "@/components/kanban/column";
import { KanbanNewColumn } from "./new-column";
import { kanbanBoardStore } from "@/proxies/kanbanBoardStore";
import { useSnapshot } from "valtio";

export function KanbanBoard() {
  const boardData = useSnapshot(kanbanBoardStore);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId, type } = result;

    // If there's no destination or the item was dropped back to its original position
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    // If we're dragging columns
    if (type === "column") {
      const newColumnOrder = Array.from(boardData.columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      kanbanBoardStore.columnOrder = newColumnOrder;
      return;
    }

    // Source and destination columns
    const sourceColumn = boardData.columns[source.droppableId];
    const destColumn = boardData.columns[destination.droppableId];

    // If moving within the same column
    if (sourceColumn === destColumn) {
      const newTaskIds = Array.from(sourceColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...sourceColumn,
        taskIds: newTaskIds,
      };

      kanbanBoardStore.columns[newColumn.id] = newColumn;

      return;
    }

    // Moving from one column to another
    const sourceTaskIds = Array.from(sourceColumn.taskIds);
    sourceTaskIds.splice(source.index, 1);
    const newSourceColumn = {
      ...sourceColumn,
      taskIds: sourceTaskIds,
    };

    const destTaskIds = Array.from(destColumn.taskIds);
    destTaskIds.splice(destination.index, 0, draggableId);
    const newDestColumn = {
      ...destColumn,
      taskIds: destTaskIds,
    };

    kanbanBoardStore.columns[newSourceColumn.id] = newSourceColumn;
    kanbanBoardStore.columns[newDestColumn.id] = newDestColumn;
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="all-columns" direction="horizontal" type="column">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="
              inline-flex gap-3 overflow-hidden px-[var(--global-px)]
              lg:px-[var(--global-px-lg)]
              "
          >
            {boardData.columnOrder.map((columnId, index) => {
              const column = boardData.columns[columnId];
              const tasks = column.taskIds.map(
                (taskId) => boardData.tasks[taskId]
              );

              return (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  tasks={tasks}
                  index={index}
                />
              );
            })}
            {provided.placeholder}
            <KanbanNewColumn />
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
