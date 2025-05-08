import { BoardModified, Column, Task } from "@/types";
import { proxy } from "valtio";
import { nanoid } from "nanoid";

export const addNewTask = (columnId: string, title: string) => {
  const newTaskId = nanoid();
  const newTask: Task = {
    _id: newTaskId,
    title,
    assignee: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    __v: 0,
  };

  const column = kanbanBoardStore.columns[columnId];
  const newTaskIds = Array.from(column.tasks);
  newTaskIds.push(newTaskId);

  kanbanBoardStore.tasks[newTaskId] = newTask;
  kanbanBoardStore.columns[columnId] = {
    ...column,
    tasks: newTaskIds,
  };
};

export const addNewColumn = (newColumnTitle: string) => {
  if (!newColumnTitle.trim()) return;

  const newColumnId = nanoid();
  const newColumn: Column = {
    _id: newColumnId,
    title: newColumnTitle,
    tasks: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    __v: 0,
  };

  kanbanBoardStore.columns[newColumnId] = newColumn;
  kanbanBoardStore.columnOrder = [...kanbanBoardStore.columnOrder, newColumnId];
};

export const deleteTask = (columnId: string, taskId: string) => {
  const column = kanbanBoardStore.columns[columnId];
  const newTaskIds = column.tasks.filter((id) => id !== taskId);

  const newTasks = { ...kanbanBoardStore.tasks };
  delete newTasks[taskId];

  kanbanBoardStore.tasks = newTasks;
  kanbanBoardStore.columns[columnId].tasks = newTaskIds;
};

export const deleteColumn = (columnId: string) => {
  const column = kanbanBoardStore.columns[columnId];
  const newTasks = { ...kanbanBoardStore.tasks };
  column.tasks.forEach((tasks) => {
    delete newTasks[tasks];
  });

  const newColumns = { ...kanbanBoardStore.columns };
  delete newColumns[columnId];

  const newColumnOrder = kanbanBoardStore.columnOrder.filter(
    (id) => id !== columnId
  );

  kanbanBoardStore.tasks = newTasks;
  kanbanBoardStore.columns = newColumns;
  kanbanBoardStore.columnOrder = newColumnOrder;
};

export const moveTask = (
  sourceColumnId: string,
  destinationColumnId: string,
  taskId: string,
  destinationIndex: number
) => {
  if (sourceColumnId === destinationColumnId) return;

  const sourceColumn = kanbanBoardStore.columns[sourceColumnId];
  const destinationColumn = kanbanBoardStore.columns[destinationColumnId];

  const newSourceTaskIds = sourceColumn.tasks.filter((id) => id !== taskId);

  const newDestinationTaskIds = Array.from(destinationColumn.tasks);
  newDestinationTaskIds.splice(destinationIndex, 0, taskId);

  kanbanBoardStore.columns[sourceColumnId] = {
    ...sourceColumn,
    tasks: newSourceTaskIds,
  };

  kanbanBoardStore.columns[destinationColumnId] = {
    ...destinationColumn,
    tasks: newDestinationTaskIds,
  };
};

export const getAllColumnTitlesAndIds = () => {
  return Object.entries(kanbanBoardStore.columns).map(([id, column]) => ({
    id: id,
    title: column.title,
  }));
};

export const kanbanBoardStore = proxy<BoardModified>();
