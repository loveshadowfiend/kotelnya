import { KanbanBoardState } from "./types";

export const kanbanSample: KanbanBoardState = {
  tasks: {
    "task-1": {
      id: "task-1",
      title: "Сделать домашку",
      description: "Математика, физика",
    },
    "task-2": {
      id: "task-2",
      title: "Помыть посуду",
      description: "",
    },
    "task-4": {
      id: "task-4",
      title: "Добавить функционал добавления задач",
      description: "Реализовать возможность добавления новых задач в колонки.",
    },
    "task-5": {
      id: "task-5",
      title: "Сходить в магазин",
      description: "Купить молоко, яйца и масло",
    },
    "task-6": {
      id: "task-6",
      title: "Реализовать перетаскивание",
      description: "Добавить возможность перетаскивания задач между колонками",
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
