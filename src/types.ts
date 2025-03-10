export type Task = {
  id: string;
  title: string;
  description: string;
  order: number;
};

export type TaskCategory = {
  id: string;
  title: string;
  order: number;
  tasks: Task[];
};
