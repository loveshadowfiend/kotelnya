import { NotesState } from "@/types";
import { proxy } from "valtio";

export const boardsStore = proxy<NotesState>();
