import { NotesState } from "@/types";
import { proxy } from "valtio";

export const notesStore = proxy<NotesState>({
  notes: null,
  loading: true,
  error: null,
});
