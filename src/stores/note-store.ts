import { NoteState } from "@/types";
import { proxy } from "valtio";

export const noteStore = proxy<NoteState>();
