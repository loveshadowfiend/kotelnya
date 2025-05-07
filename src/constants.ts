import { BoardModified, KanbanBoardState } from "./types";

export const kanbanSample: BoardModified = {
  _id: "board-1",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  __v: 0,
  tasks: {
    "task-1": {
      _id: "task-1",
      title: "Сделать домашку",
      assignee: "Иван",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0,
    },
    "task-2": {
      _id: "task-2",
      title: "Помыть посуду",
      assignee: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0,
    },
    "task-4": {
      _id: "task-4",
      title: "Добавить функционал добавления задач",
      assignee: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0,
    },
    "task-5": {
      _id: "task-5",
      title: "Сходить в магазин",
      assignee: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0,
    },
    "task-6": {
      _id: "task-6",
      title: "Реализовать перетаскивание",
      assignee: "Дмитрий",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0,
    },
  },
  columns: {
    "column-1": {
      _id: "column-1",
      title: "Очередь",
      tasks: ["task-1", "task-2"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0,
    },
    "column-2": {
      _id: "column-2",
      title: "В процессе",
      tasks: ["task-4"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0,
    },
    "column-3": {
      _id: "column-3",
      title: "Готово",
      tasks: ["task-5", "task-6"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0,
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
