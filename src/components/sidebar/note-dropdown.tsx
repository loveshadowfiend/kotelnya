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
import { Edit, Router, Trash2 } from "lucide-react";
import { notesStore, deleteNote } from "@/stores/notes-store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useParams } from "next/navigation";

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
  const params = useParams();
  const router = useRouter();
  const notesSnapshot = useSnapshot(notesStore);

  async function handleDeleteNote() {
    if (params.noteId && params.noteId === noteId) {
      router.push("/");
    }

    await deleteNote(noteId);

    if (notesStore.error) {
      toast.error(`Возникла ошибка: ${notesStore.error}`);
    } else {
      toast.success(`Заметка ${noteTitle} успешно удалена`);
    }
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
