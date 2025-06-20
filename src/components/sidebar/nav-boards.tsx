"use client";

import Link from "next/link";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "../ui/sidebar";
import { Ellipsis, Kanban, Loader2, Plus } from "lucide-react";
import { BoardDropdown } from "./board-dropdown";
import { useEffect } from "react";
import { boardsStore } from "@/stores/boards-store";
import { useSnapshot } from "valtio";
import { Skeleton } from "../ui/skeleton";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { AddBoard } from "./add-board";
import { projectStore } from "@/stores/project-store";
import { getBoards } from "@/api/boards/route";
import { toast } from "sonner";

export function NavBoards() {
  const boardsSnapshot = useSnapshot(boardsStore);
  const projectSnapshot = useSnapshot(projectStore);

  // TODO: transfer logic to api/boards/routes.ts
  useEffect(() => {
    if (!projectSnapshot.project) return;

    async function fetchBoards() {
      boardsStore.loading = true;

      const response = await getBoards(projectSnapshot.project!._id);

      if (response.ok) {
        const data = await response.json();
        boardsStore.boards = data;
      } else {
        toast.error(
          "не удалось загрузить доски. пожалуйста, попробуйте позже."
        );
      }

      boardsStore.loading = false;
    }

    fetchBoards();
  }, [projectSnapshot]);

  if (boardsSnapshot.loading || !projectSnapshot.project) {
    return (
      <>
        <SidebarMenuButton className="pointer-events-none">
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
    <>
      <Collapsible defaultOpen className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton>
              <Kanban />
              <span>канбан-доски</span>
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <AddBoard>
            <SidebarMenuAction>
              <Plus />
            </SidebarMenuAction>
          </AddBoard>
          <CollapsibleContent>
            <SidebarMenuSub>
              {boardsSnapshot.boards &&
                boardsSnapshot.boards.map((board) => {
                  return (
                    <SidebarMenuSubItem
                      key={board._id}
                      className="text-muted-foreground"
                    >
                      <SidebarMenuButton className="w-41 truncate" asChild>
                        <Link href={`/board/${board._id}`}>{board.title}</Link>
                      </SidebarMenuButton>
                      <BoardDropdown
                        boardId={board._id}
                        boardTitle={board.title}
                      >
                        <SidebarMenuAction
                          className="text-muted-foreground"
                          showOnHover
                        >
                          <Ellipsis /> <span className="sr-only">Еще</span>
                        </SidebarMenuAction>
                      </BoardDropdown>
                    </SidebarMenuSubItem>
                  );
                })}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    </>
  );
}
