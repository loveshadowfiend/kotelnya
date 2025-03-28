import { KanbanBoardState } from "./types";

export const kanbanSample: KanbanBoardState = {
  tasks: {
    "task-1": {
      id: "task-1",
      title: "Сделать домашку",
      description: "Математика, физика",
      assignee: "Иван",
      dueDate: "2023-10-15",
    },
    "task-2": {
      id: "task-2",
      title: "Помыть посуду",
      description: "",
      assignee: "",
      dueDate: "2023-10-16",
    },
    "task-4": {
      id: "task-4",
      title: "Добавить функционал добавления задач",
      description: "Реализовать возможность добавления новых задач в колонки.",
      assignee: "",
      dueDate: "2023-10-20",
    },
    "task-5": {
      id: "task-5",
      title: "Сходить в магазин",
      description: "Купить молоко, яйца и масло",
      assignee: "",
      dueDate: "2023-10-14",
    },
    "task-6": {
      id: "task-6",
      title: "Реализовать перетаскивание",
      description: "Добавить возможность перетаскивания задач между колонками",
      assignee: "Дмитрий",
      dueDate: "2023-10-18",
    },
  },
  columns: {
    "column-1": {
      id: "column-1",
      title: "Очередь",
      taskIds: ["task-1", "task-2"],
    },
    "column-2": {
      id: "column-2",
      title: "В процессе",
      taskIds: ["task-4"],
    },
    "column-3": {
      id: "column-3",
      title: "Готово",
      taskIds: ["task-5", "task-6"],
    },
  },
  columnOrder: ["column-1", "column-2", "column-3"],
};

export const mockUsers = [
  { id: "user-1", name: "Иван" },
  { id: "user-2", name: "Дмитрий" },
  { id: "user-3", name: "Марина" },
  { id: "user-4", name: "Алексей" },
  { id: "user-5", name: "Анна" },
];
