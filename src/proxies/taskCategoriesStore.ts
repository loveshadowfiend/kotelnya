import { TaskCategory } from "@/types";
import { proxy } from "valtio";

type taskCategoriesStore = {
  [id: string]: TaskCategory;
};

export const taskCategoriesStore = proxy<taskCategoriesStore>({});
