import { NotesState } from "@/types";
import { proxy } from "valtio";
import { deleteNote as deleteNoteApi } from "@/api/notes/routes";

export const deleteNote = async (noteId: string) => {
  notesStore.loading = true;

  const response = await deleteNoteApi(noteId);

  if (response.ok) {
    const newNotes =
      notesStore.notes?.filter((note) => note._id !== noteId) ?? null;

    notesStore.notes = newNotes;
  } else {
    notesStore.error = response.statusText;
  }

  notesStore.loading = false;
};

export const notesStore = proxy<NotesState>({
  notes: null,
  loading: true,
  error: null,
});
