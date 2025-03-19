"use client";

import { useState } from "react";
import { DragDropContext, Droppable, type DropResult } from "@hello-pangea/dnd";
import { KanbanColumn } from "@/components/kanban/kanban-column";
import { kanbanSample } from "@/constants";
import { KanbanBoardStore } from "@/types";

export function KanbanBoard() {
  const [boardData, setBoardData] = useState<KanbanBoardStore>(kanbanSample);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

      setBoardData({
        ...boardData,
        columnOrder: newColumnOrder,
      });
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

      setBoardData({
        ...boardData,
        columns: {
          ...boardData.columns,
          [newColumn.id]: newColumn,
        },
      });
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

    setBoardData({
      ...boardData,
      columns: {
        ...boardData.columns,
        [newSourceColumn.id]: newSourceColumn,
        [newDestColumn.id]: newDestColumn,
      },
    });
  };

  const addNewColumn = () => {
    if (!newColumnTitle.trim()) return;

    const newColumnId = `column-${Date.now()}`;
    const newColumn = {
      id: newColumnId,
      title: newColumnTitle,
      taskIds: [],
    };

    setBoardData({
      ...boardData,
      columns: {
        ...boardData.columns,
        [newColumnId]: newColumn,
      },
      columnOrder: [...boardData.columnOrder, newColumnId],
    });

    setNewColumnTitle("");
    setIsDialogOpen(false);
  };

  const addNewTask = (columnId: string, title: string) => {
    const newTaskId = `task-${Date.now()}`;
    const newTask = {
      id: newTaskId,
      title,
      description: "",
    };

    const column = boardData.columns[columnId];
    const newTaskIds = Array.from(column.taskIds);
    newTaskIds.push(newTaskId);

    setBoardData({
      ...boardData,
      tasks: {
        ...boardData.tasks,
        [newTaskId]: newTask,
      },
      columns: {
        ...boardData.columns,
        [columnId]: {
          ...column,
          taskIds: newTaskIds,
        },
      },
    });
  };

  const deleteTask = (columnId: string, taskId: string) => {
    const column = boardData.columns[columnId];
    const newTaskIds = column.taskIds.filter((id) => id !== taskId);

    const newTasks = { ...boardData.tasks };
    delete newTasks[taskId];

    setBoardData({
      ...boardData,
      tasks: newTasks,
      columns: {
        ...boardData.columns,
        [columnId]: {
          ...column,
          taskIds: newTaskIds,
        },
      },
    });
  };

  const deleteColumn = (columnId: string) => {
    // Remove all tasks in this column
    const column = boardData.columns[columnId];
    const newTasks = { ...boardData.tasks };
    column.taskIds.forEach((taskId) => {
      delete newTasks[taskId];
    });

    // Remove the column
    const newColumns = { ...boardData.columns };
    delete newColumns[columnId];

    // Update column order
    const newColumnOrder = boardData.columnOrder.filter(
      (id) => id !== columnId
    );

    setBoardData({
      tasks: newTasks,
      columns: newColumns,
      columnOrder: newColumnOrder,
    });
  };

  return (
    <div className="flex flex-col">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId="all-columns"
          direction="horizontal"
          type="column"
        >
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="
              grid grid-cols-1 gap-3 overflow-x-auto
              md:grid-cols-2 
              lg:grid-cols-3 
              xl:grid-cols-4
              xxl:grid-cols--5
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
                    onAddTask={addNewTask}
                    onDeleteTask={deleteTask}
                    onDeleteColumn={deleteColumn}
                  />
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
