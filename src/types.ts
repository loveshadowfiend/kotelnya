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

export type Board = {
  _id: string;
  title: string;
  tasks: Task[];
  columns: Column[];
  columnOrder: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type BoardModified = {
  _id: string;
  title: string;
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
  assignee: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type Note = {
  _id: string;
  title: string;
  markdownContent: string;
  author: string;
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

export type ProjectState = {
  project: Project | null;
  loading: boolean;
};

export type ProjectsState = {
  projects: Project[] | null;
  loading: boolean;
  error: string | null;
};

export type BoardState = {
  board: BoardModified;
};

export type BoardsState = {
  boards: Board[] | null;
  loading: boolean;
  error: string | null;
};

export type NotesState = {
  notes: Note[] | null;
  loading: boolean;
  error: string | null;
};

export type UserState = {
  user: User | null;
  loading: boolean;
};
