import { KanbanBoardStore } from "./types";

export const kanbanSample: KanbanBoardStore = {
  tasks: {
    "task-1": {
      id: "task-1",
      title: "Создать структуру проекта",
      description: "Определить основные папки и файлы проекта.",
    },
    "task-2": {
      id: "task-2",
      title: "Разработать UI-компоненты",
      description: "Создать основные пользовательские интерфейсы.",
    },
    "task-3": {
      id: "task-3",
      title: "Реализовать перетаскивание",
      description: "Добавить возможность перетаскивания задач между колонками.",
    },
    "task-4": {
      id: "task-4",
      title: "Добавить функционал добавления задач",
      description: "Реализовать возможность добавления новых задач в колонки.",
    },
    "task-5": {
      id: "task-5",
      title: "Написать документацию",
      description:
        "Создать документацию для проекта, описывающую его функционал.",
    },
    "task-6": {
      id: "task-6",
      title: "Протестировать на разных устройствах",
      description:
        "Проверить корректность работы приложения на различных устройствах и браузерах.",
    },
  },
  columns: {
    "column-1": {
      id: "column-1",
      title: "К выполнению",
      taskIds: ["task-1", "task-2", "task-3"],
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
