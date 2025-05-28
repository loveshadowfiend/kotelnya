"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import { useSnapshot } from "valtio";
import { noteStore } from "@/stores/note-store";
import { Loader2 } from "lucide-react";

interface NoteBreadcrumbProps {
  noteId: string;
}

export function NoteBreadcrumb({ noteId }: NoteBreadcrumbProps) {
  const noteSnapshot = useSnapshot(noteStore);

  return (
    <div className="fixed flex justify-between w-full bg-background z-10000 border-b">
      <Breadcrumb className="flex items-center h-[64px] px-[var(--global-px)] w-full lg:px-[var(--global-px-lg)]">
        <BreadcrumbList>
          <div className="flex h-4 items-center gap-3 mr-3">
            <SidebarTrigger />
            <Separator className="h-1 min-h-0" orientation="vertical" />
          </div>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Главная</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Заметки</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="flex items-center">
              {(!noteSnapshot.note ||
                (noteSnapshot.note && noteSnapshot.note?._id !== noteId)) && (
                <Loader2 className="animate-spin h-4 w-4" />
              )}
              {noteSnapshot.note && <span>{noteSnapshot.note.title}</span>}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
