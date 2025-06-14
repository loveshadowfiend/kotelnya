import { updateBoard } from "@/api/boards/route";
import { unmodifyBoardObject } from "@/lib/utils";
import { BoardModified, Column, Task } from "@/types";
import { proxy } from "valtio";

export const addNewTask = (
  newTaskId: string,
  columnId: string,
  title: string
) => {
  const newTask: Task = {
    _id: newTaskId,
    title,
    description: "",
    assignee: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    dueDate: new Date().toISOString(),
    __v: 0,
  };

  const column = boardStore.columns[columnId];
  const newTaskIds = Array.from(column.tasks);
  newTaskIds.push(newTaskId);

  boardStore.tasks[newTaskId] = newTask;
  boardStore.columns[columnId] = {
    ...column,
    tasks: newTaskIds,
  };
};

export const addNewColumn = (newColumnId: string, newColumnTitle: string) => {
  if (!newColumnTitle.trim()) return;

  const newColumn: Column = {
    _id: newColumnId,
    title: newColumnTitle,
    tasks: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    __v: 0,
  };

  boardStore.columns[newColumnId] = newColumn;
  boardStore.columnOrder = [...boardStore.columnOrder, newColumnId];
};

export const deleteTask = (columnId: string, taskId: string) => {
  const column = boardStore.columns[columnId];
  const newTaskIds = column.tasks.filter((id) => id !== taskId);

  const newTasks = { ...boardStore.tasks };
  delete newTasks[taskId];

  boardStore.tasks = newTasks;
  boardStore.columns[columnId].tasks = newTaskIds;
};

export const deleteColumn = (columnId: string) => {
  const column = boardStore.columns[columnId];
  const newTasks = { ...boardStore.tasks };
  column.tasks.forEach((tasks) => {
    delete newTasks[tasks];
  });

  const newColumns = { ...boardStore.columns };
  delete newColumns[columnId];

  const newColumnOrder = boardStore.columnOrder.filter((id) => id !== columnId);

  boardStore.tasks = newTasks;
  boardStore.columns = newColumns;
  boardStore.columnOrder = newColumnOrder;
};

export const moveTask = (
  boardId: string,
  sourceColumnId: string,
  destinationColumnId: string,
  taskId: string,
  destinationIndex: number
) => {
  if (sourceColumnId === destinationColumnId) return;

  const sourceColumn = boardStore.columns[sourceColumnId];
  const destinationColumn = boardStore.columns[destinationColumnId];

  const newSourceTaskIds = sourceColumn.tasks.filter((id) => id !== taskId);

  const newDestinationTaskIds = Array.from(destinationColumn.tasks);
  newDestinationTaskIds.splice(destinationIndex, 0, taskId);

  boardStore.columns[sourceColumnId] = {
    ...sourceColumn,
    tasks: newSourceTaskIds,
  };

  boardStore.columns[destinationColumnId] = {
    ...destinationColumn,
    tasks: newDestinationTaskIds,
  };

  const mongoBoard = unmodifyBoardObject(boardStore);

  updateBoard(boardId, {
    tasks: mongoBoard.tasks,
    columns: mongoBoard.columns,
    columnOrder: mongoBoard.columnOrder,
  });
};

export const getAllColumnTitlesAndIds = () => {
  return Object.entries(boardStore.columns).map(([id, column]) => ({
    id: id,
    title: column.title,
  }));
};

export const boardStore = proxy<BoardModified>();
