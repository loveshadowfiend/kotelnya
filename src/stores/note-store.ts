import { Note } from "@/types";
import { proxy } from "valtio";

export const noteStore = proxy<Note>();
