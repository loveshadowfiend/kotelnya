import { kanbanSample } from "@/constants";
import { KanbanBoardState } from "@/types";
import { proxy } from "valtio";
import { nanoid } from "nanoid";

export const addNewTask = (columnId: string, title: string) => {
  const newTaskId = nanoid();
  const newTask = {
    id: newTaskId,
    title,
    description: "",
    assignee: "",
    dueDate: "",
  };

  const column = kanbanBoardStore.columns[columnId];
  const newTaskIds = Array.from(column.taskIds);
  newTaskIds.push(newTaskId);

  kanbanBoardStore.tasks[newTaskId] = newTask;
  kanbanBoardStore.columns[columnId] = {
    ...column,
    taskIds: newTaskIds,
  };
};

export const addNewColumn = (newColumnTitle: string) => {
  if (!newColumnTitle.trim()) return;

  const newColumnId = nanoid();
  const newColumn = {
    id: newColumnId,
    title: newColumnTitle,
    taskIds: [],
  };

  kanbanBoardStore.columns[newColumnId] = newColumn;
  kanbanBoardStore.columnOrder = [...kanbanBoardStore.columnOrder, newColumnId];
};

export const deleteTask = (columnId: string, taskId: string) => {
  const column = kanbanBoardStore.columns[columnId];
  const newTaskIds = column.taskIds.filter((id) => id !== taskId);

  const newTasks = { ...kanbanBoardStore.tasks };
  delete newTasks[taskId];

  kanbanBoardStore.tasks = newTasks;
  kanbanBoardStore.columns[columnId].taskIds = newTaskIds;
};

export const deleteColumn = (columnId: string) => {
  const column = kanbanBoardStore.columns[columnId];
  const newTasks = { ...kanbanBoardStore.tasks };
  column.taskIds.forEach((taskId) => {
    delete newTasks[taskId];
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
  const sourceColumn = kanbanBoardStore.columns[sourceColumnId];
  const destinationColumn = kanbanBoardStore.columns[destinationColumnId];

  const newSourceTaskIds = sourceColumn.taskIds.filter((id) => id !== taskId);

  const newDestinationTaskIds = Array.from(destinationColumn.taskIds);
  newDestinationTaskIds.splice(destinationIndex, 0, taskId);

  kanbanBoardStore.columns[sourceColumnId] = {
    ...sourceColumn,
    taskIds: newSourceTaskIds,
  };

  kanbanBoardStore.columns[destinationColumnId] = {
    ...destinationColumn,
    taskIds: newDestinationTaskIds,
  };
};

export const getAllColumnTitlesAndIds = () => {
  return Object.entries(kanbanBoardStore.columns).map(([id, column]) => ({
    id: id,
    title: column.title,
  }));
};

export const kanbanBoardStore = proxy<KanbanBoardState>(kanbanSample);
