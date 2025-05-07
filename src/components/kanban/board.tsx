"use client";

import { DragDropContext, Droppable, type DropResult } from "@hello-pangea/dnd";
import { KanbanColumn } from "@/components/kanban/column";
import { KanbanNewColumn } from "./new-column";
import { kanbanBoardStore } from "@/proxies/kanban-board-store";
import { useSnapshot } from "valtio";
import { getAuthToken } from "@/lib/auth";
import { Board, BoardModified } from "@/types";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

interface KanbanBoardProps {
  boardId: string;
}

export function KanbanBoard({ boardId }: KanbanBoardProps) {
  const boardData = useSnapshot(kanbanBoardStore);

  const fetchBoard = async () => {
    const token = await getAuthToken();
    const response = await fetch(
      `http://103.249.132.70:9001/api/boards/${boardId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const boardData: Board = await response.json();

    if (response.ok) {
      const board: BoardModified = {
        ...boardData,
        tasks: Object.fromEntries(
          boardData.tasks.map((task) => [
            task._id,
            {
              _id: task._id,
              title: task.title,
              assignee: task.assignee,
              createdAt: task.createdAt,
              updatedAt: task.updatedAt,
              __v: task.__v,
            },
          ])
        ),
        columns: Object.fromEntries(
          boardData.columns.map((column) => [
            column._id,
            {
              _id: column._id,
              title: column.title,
              tasks: column.tasks,
              createdAt: column.createdAt,
              updatedAt: column.updatedAt,
              __v: column.__v,
            },
          ])
        ),
      };
      return board;
    } else {
      return null;
    }
  };

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
      const newTaskIds = Array.from(sourceColumn.tasks);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...sourceColumn,
        tasks: newTaskIds,
      };

      kanbanBoardStore.columns[newColumn._id] = newColumn;

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

    kanbanBoardStore.columns[newSourceColumn._id] = newSourceColumn;
    kanbanBoardStore.columns[newDestColumn._id] = newDestColumn;
  };

  useEffect(() => {
    const fetchAndSetBoard = async () => {
      const board = await fetchBoard();
      if (board) {
        Object.assign(kanbanBoardStore, board);
      }
    };
    fetchAndSetBoard();
  }, [boardId]);

  if (Object.keys(boardData).length === 0 && boardData.constructor === Object) {
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
            {boardData.columnOrder.map((columnId, index) => {
              const column = boardData.columns[columnId];
              const tasks = column.tasks.map(
                (taskId) => boardData.tasks[taskId]
              );

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
            <KanbanNewColumn />
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
