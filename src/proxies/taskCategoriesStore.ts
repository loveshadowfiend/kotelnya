import { proxy } from "valtio";
import { nanoid } from "nanoid";
import { TaskCategoriesStore } from "@/types";

export const addTask = (categoryID: string, title: string) => {
  const taskID = nanoid();

  taskCategoriesStore[categoryID].tasks.push({
    id: taskID,
    title: title,
    description: "",
    order: 0,
  });
};

export const addCategory = (title: string) => {
  const categoryID = nanoid();

  taskCategoriesStore[categoryID] = {
    id: categoryID,
    title: title,
    tasks: [],
    order: 0,
  };
};

export const taskCategoriesStore = proxy<TaskCategoriesStore>({});
