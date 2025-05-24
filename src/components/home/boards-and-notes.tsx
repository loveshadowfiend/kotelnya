"use client";

import { boardsStore } from "@/stores/boards-store";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useSnapshot } from "valtio";
import { BookHeart, Kanban, Plus } from "lucide-react";
import Link from "next/link";
import { notesStore } from "@/stores/notes-store";
import { AddBoard } from "../sidebar/add-board";
import { AddNote } from "../sidebar/add-note";
import { Skeleton } from "../ui/skeleton";

interface BoardsAndNotesProps {
  variant: "boards" | "notes";
}

export function BoardsAndNotes({ variant }: BoardsAndNotesProps) {
  const boardsSnapshot = useSnapshot(boardsStore);
  const notesSnapshot = useSnapshot(notesStore);

  if (variant === "boards" && boardsSnapshot.boards === null) {
    return BoardsAndNotesSkeleton();
  }

  if (variant === "notes" && notesSnapshot.notes === null) {
    return BoardsAndNotesSkeleton();
  }

  return (
    <>
      <div className="flex gap-2 text-muted-foreground items-center w-full px-10 mt-10 mb-3">
        {variant === "boards" && (
          <>
            <Kanban className="h-4 w-4" />
            <span className="text-sm">доски</span>
          </>
        )}
        {variant === "notes" && (
          <>
            <BookHeart className="h-4 w-4" />
            <span className="text-sm">заметки</span>
          </>
        )}
      </div>
      <div className="flex w-full gap-3 px-10">
        <ScrollArea className="w-1 flex-1 rounded-md">
          <div className="flex gap-2 pb-5">
            {variant === "boards" &&
              boardsSnapshot.boards?.map((board) => (
                <Link
                  className="w-60 h-40 border rounded-md text-sm flex-shrink-0 text-muted-foreground hover:text-foreground"
                  key={board._id}
                  href={`/board/${board._id}`}
                >
                  <div className="h-[66%] bg-muted" />
                  <div className="flex h-[33%] items-center justify-center">
                    <span className="truncate">{board.title}</span>
                  </div>
                </Link>
              ))}
            {variant === "notes" &&
              notesSnapshot.notes?.map((note) => (
                <Link
                  className="w-60 h-40 border rounded-md text-sm flex-shrink-0 text-muted-foreground hover:text-foreground"
                  key={note._id}
                  href={`/note/${note._id}`}
                >
                  <div className="h-[66%] bg-muted" />
                  <div className="flex h-[33%] items-center justify-center">
                    <span className="truncate">{note.title}</span>
                  </div>
                </Link>
              ))}
            {variant === "boards" && (
              <AddBoard>
                <div className="flex w-60 h-40 border rounded-md items-center justify-center gap-2 text-sm text-muted-foreground hover:cursor-pointer hover:text-foreground">
                  <Plus className="h-4 w-4" />
                  добавить доску
                </div>
              </AddBoard>
            )}
            {variant === "notes" && (
              <AddNote>
                <div className="flex w-60 h-40 border rounded-md items-center justify-center gap-2 text-sm text-muted-foreground hover:cursor-pointer hover:text-foreground">
                  <Plus className="h-4 w-4" />
                  добавить заметку
                </div>
              </AddNote>
            )}
          </div>
          <ScrollBar orientation="horizontal" className="w-full" />
        </ScrollArea>
      </div>
    </>
  );
}

export function BoardsAndNotesSkeleton() {
  return (
    <>
      <div className="flex gap-2 text-muted-foreground items-center w-full px-10 mt-10 mb-3">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="flex w-full gap-3 px-10">
        <ScrollArea className="w-1 flex-1 rounded-md">
          <div className="flex gap-2 pb-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="w-60 h-40 rounded-md" />
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="w-full hidden" />
        </ScrollArea>
      </div>
    </>
  );
}
