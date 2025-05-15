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
import { boardStore } from "@/stores/board-store";
import { Loader2 } from "lucide-react";

interface KanbanBreadcrumbProps {
  boardId: string;
}

export function KanbanBreadcrumb({ boardId }: KanbanBreadcrumbProps) {
  const boardSnapshot = useSnapshot(boardStore);
  const isBoardEmpty =
    Object.keys(boardSnapshot).length === 0 &&
    boardSnapshot.constructor === Object;

  return (
    <div className="fixed flex justify-between w-full border-b z-50 bg-background h-[65px]">
      <Breadcrumb className="flex items-center pl-8 w-full">
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
            <BreadcrumbLink href="/">Канбан-доска</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="flex items-center">
              {(isBoardEmpty || boardSnapshot._id !== boardId) && (
                <Loader2 className="animate-spin h-4 w-4" />
              )}
              {!isBoardEmpty && boardSnapshot._id === boardId && (
                <span>{boardSnapshot.title}</span>
              )}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
