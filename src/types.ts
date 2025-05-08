export type KanbanComponentsState = {
  boardId: string;
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

export type Board = {
  _id: string;
  tasks: Task[];
  columns: Column[];
  columnOrder: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type BoardModified = {
  _id: string;
  tasks: {
    [key: string]: Task;
  };
  columns: {
    [key: string]: Column;
  };
  columnOrder: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type Column = {
  _id: string;
  title: string;
  tasks: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type Task = {
  _id: string;
  title: string;
  assignee: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type Note = {
  _id: string;
  title: string;
  markdownContent: string;
  author: User;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type Project = {
  _id: string;
  title: string;
  status: string;
  users: User[];
  boards: Board[];
  notes: Note[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type ProjectsState = {
  projects: Project[];
  loading: boolean;
  error: string | null;
};

export type BoardsState = {
  boards: Board[];
  loading: boolean;
  error: string | null;
};
