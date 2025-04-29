export type KanbanTask = {
  id: string;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
};

export type KanbanTasks = {
  [id: string]: KanbanTask;
};

export type KanbanColumn = {
  id: string;
  title: string;
  taskIds: readonly string[];
};

export type KanbanColumns = {
  [id: string]: KanbanColumn;
};

export type KanbanBoardState = {
  tasks: KanbanTasks;
  columns: KanbanColumns;
  columnOrder: string[];
};

export type KanbanComponentsState = {
  isAddingTask: boolean;
  isAddingCategory: boolean;
  addNewTaskActiveColumn: string;
  renamingColumn: string;
};

export type User = {
  _id: string;
  username: string;
  email: string;
  avatarUrl: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
