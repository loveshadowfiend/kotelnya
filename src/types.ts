export type KanbanTasks = {
  [id: string]: {
    id: string;
    title: string;
    description: string;
  };
};

export type KanbanColumns = {
  [id: string]: {
    id: string;
    title: string;
    taskIds: string[];
  };
};

export type KanbanBoardStore = {
  tasks: KanbanTasks;
  columns: KanbanColumns;
  columnOrder: string[];
};

export type KanbanStore = {
  isAddingTask: false;
  isAddingCategory: false;
};
