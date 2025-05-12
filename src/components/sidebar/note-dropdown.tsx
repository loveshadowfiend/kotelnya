"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSnapshot } from "valtio";
import { Edit, Trash2 } from "lucide-react";
import { notesStore, deleteNote } from "@/stores/notes-store";

interface NoteDropdownProps {
  children: React.ReactNode;
  noteId: string;
  noteTitle: string;
}

export function NoteDropdown({
  children,
  noteId,
  noteTitle,
}: NoteDropdownProps) {
  const notesSnapshot = useSnapshot(notesStore);

  async function handleDeleteNote() {
    await deleteNote(noteId);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="shadow-none w-[240px]">
        <DropdownMenuLabel className="text-sm font-normal">
          {noteTitle}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Edit />
          Переименовать
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDeleteNote}>
          <Trash2 />
          <span>Удалить</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
