"use client";

import { useSnapshot } from "valtio";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "../ui/collapsible";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuAction,
} from "../ui/sidebar";
import { BookHeart, Plus } from "lucide-react";
import Link from "next/link";
import { notesStore } from "@/stores/notes-store";
import { useEffect } from "react";
import { getNotes } from "@/api/auth/notes/routes";
import { Skeleton } from "../ui/skeleton";
import { AddNote } from "./add-note";
import { projectStore } from "@/stores/project-store";

export function NavNotes() {
  const notesSnapshot = useSnapshot(notesStore);
  const projectSnapshot = useSnapshot(projectStore);

  useEffect(() => {
    if (!projectSnapshot.project) return;

    async function fetchNotes() {
      notesStore.loading = true;

      const response = await getNotes(projectSnapshot.project?._id);

      if (response.ok) {
        const data = await response.json();
        notesStore.notes = data;
      }

      notesStore.loading = false;
    }

    fetchNotes();
  }, [projectSnapshot]);

  if (notesSnapshot.loading || !projectSnapshot.project) {
    return (
      <>
        <SidebarMenuButton>
          <Skeleton className="w-60 h-6" />
        </SidebarMenuButton>
        {[...Array(2)].map((_, idx) => (
          <SidebarMenuSub
            className="text-muted-foreground pointer-events-none"
            key={idx}
          >
            <SidebarMenuButton>
              <Skeleton className="w-full h-6" />
            </SidebarMenuButton>
          </SidebarMenuSub>
        ))}
      </>
    );
  }

  return (
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            <BookHeart />
            <span>Заметки</span>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <SidebarMenuAction>
          <AddNote>
            <Plus />
          </AddNote>
        </SidebarMenuAction>
        <CollapsibleContent>
          <SidebarMenuSub>
            {notesSnapshot.notes &&
              notesSnapshot.notes.map((note) => {
                return (
                  <SidebarMenuSubItem
                    key={note._id}
                    className="text-muted-foreground"
                  >
                    <SidebarMenuButton asChild>
                      <Link href={`/note/${note._id}`}>{note.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuSubItem>
                );
              })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
