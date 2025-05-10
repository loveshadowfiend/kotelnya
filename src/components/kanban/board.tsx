"use client";

import { DragDropContext, Droppable, type DropResult } from "@hello-pangea/dnd";
import { KanbanColumn } from "@/components/kanban/column";
import { KanbanAddColumn } from "./add-column";
import { boardStore } from "@/stores/board-store";
import { useSnapshot } from "valtio";
import { useEffect } from "react";
import { Skeleton } from "../ui/skeleton";
import { getBoard, updateBoard } from "@/api/boards/route";
import { modifyBoardObject, unmodifyBoardObject } from "@/lib/utils";
import { kanbanComponentsStore } from "@/stores/kanban-components-store";

interface KanbanBoardProps {
  boardId: string;
}

export function KanbanBoard({ boardId }: KanbanBoardProps) {
  const boardSnapshot = useSnapshot(boardStore);

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
      const newColumnOrder = Array.from(boardSnapshot.columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      boardStore.columnOrder = newColumnOrder;
      return;
    }

    // Source and destination columns
    const sourceColumn = boardSnapshot.columns[source.droppableId];
    const destColumn = boardSnapshot.columns[destination.droppableId];

    // If moving within the same column
    if (sourceColumn === destColumn) {
      const newTaskIds = Array.from(sourceColumn.tasks);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...sourceColumn,
        tasks: newTaskIds,
      };

      boardStore.columns[newColumn._id] = newColumn;

      return;
    }

    // Moving from one column to another
    const sourceTaskIds = Array.from(sourceColumn.tasks);
    sourceTaskIds.splice(source.index, 1);
    const newSourceColumn = {
      ...sourceColumn,
      tasks: sourceTaskIds,
    };

    const destTaskIds = Array.from(destColumn.tasks);
    destTaskIds.splice(destination.index, 0, draggableId);
    const newDestColumn = {
      ...destColumn,
      tasks: destTaskIds,
    };

    boardStore.columns[newSourceColumn._id] = newSourceColumn;
    boardStore.columns[newDestColumn._id] = newDestColumn;
  };

  useEffect(() => {
    kanbanComponentsStore.boardId = boardId;

    const fetchAndSetBoard = async () => {
      const boardResponse = await getBoard(boardId);
      if (boardResponse.ok) {
        const boardData = await boardResponse.json();

        Object.assign(boardStore, modifyBoardObject(boardData));
      }
    };
    fetchAndSetBoard();
  }, [boardId]);

  useEffect(() => {
    if (
      Object.keys(boardSnapshot).length === 0 &&
      boardSnapshot.constructor === Object
    )
      return;

    const mongoBoard = unmodifyBoardObject(boardStore);

    // updateBoard(boardId, {
    //   tasks: mongoBoard.tasks,
    //   columns: mongoBoard.columns,
    //   columnOrder: mongoBoard.columnOrder,
    // });
  }, [boardSnapshot, boardStore]);

  if (
    Object.keys(boardSnapshot).length === 0 &&
    boardSnapshot.constructor === Object
  ) {
    return (
      <div
        className="
          absolute inline-flex gap-3 top-20 px-[var(--global-px)]
          lg:top-24 lg:px-[var(--global-px-lg)]
        "
      >
        <Skeleton
          className="
            w-[var(--kanban-column-w)] h-[40vh] p-6
            lg:w-[var(--kanban-column-w-lg)] lg:h-[39vh]
          "
        />
        <Skeleton
          className="
            w-[var(--kanban-column-w)] h-[40vh] p-6
            lg:w-[var(--kanban-column-w-lg)] lg:h-[27vh]
          "
        />
        <Skeleton
          className="
            w-[var(--kanban-column-w)] h-[40vh] p-6
            lg:w-[var(--kanban-column-w-lg)] lg:h-[55vh]
          "
        />
      </div>
    );
  }

  console.log(JSON.stringify(boardSnapshot));

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="all-columns" direction="horizontal" type="column">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="
                inline-flex gap-3 overflow-hidden px-[var(--global-px)] pt-20
                lg:px-[var(--global-px-lg)] lg:pt-24
              "
          >
            {boardSnapshot.columnOrder.map((columnId, index) => {
              const column = boardSnapshot.columns[columnId];
              const tasks = column.tasks.map((taskId) => {
                const task = boardSnapshot.tasks[taskId];
                // Convert readonly assignee to mutable array
                return {
                  ...task,
                  assignee: Array.isArray(task.assignee)
                    ? [...task.assignee]
                    : [],
                };
              });

              return (
                <KanbanColumn
                  key={column._id}
                  column={{ ...column, tasks: [...column.tasks] }}
                  tasks={tasks}
                  index={index}
                />
              );
            })}
            {provided.placeholder}
            <KanbanAddColumn />
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
