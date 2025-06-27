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
import { useState } from "react";
import { SidebarRenameForm } from "./rename-form";

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
  const [isRenaming, setIsRenaming] = useState<boolean>(false);
  const params = useParams();
  const router = useRouter();
  const notesSnapshot = useSnapshot(notesStore);

  async function handleDeleteNote(e: React.MouseEvent) {
    if (params?.noteId && params?.noteId === noteId) {
      router.push("/");
    }

    await deleteNote(noteId);

    if (notesStore.error) {
      toast.error(`возникла ошибка: ${notesStore.error}`);
    } else {
      toast.success(`заметка "${noteTitle}" успешно удалена`);
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
        {!isRenaming && (
          <>
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault();
                setIsRenaming(true);
              }}
            >
              <Edit />
              переименовать
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive"
              onClick={handleDeleteNote}
            >
              <Trash2 className="text-destructive" />
              <span>удалить</span>
            </DropdownMenuItem>
          </>
        )}
        {isRenaming && (
          <SidebarRenameForm
            noteId={noteId}
            title={noteTitle}
            setIsRenaming={setIsRenaming}
          />
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
