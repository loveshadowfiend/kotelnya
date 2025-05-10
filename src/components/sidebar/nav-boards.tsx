"use client";

import Link from "next/link";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "../ui/sidebar";
import { getAuthToken } from "@/lib/auth";
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

export function NavBoards() {
  const boardsSnapshot = useSnapshot(boardsStore);

  useEffect(() => {
    async function fetchBoards() {
      boardsStore.loading = true;

      const token = await getAuthToken();
      const response = await fetch(
        "http://103.249.132.70:9001/api/projects/6814eb6af3982bf9826388aa/boards",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (response.ok) {
        boardsStore.boards = data;
      }

      boardsStore.loading = false;
    }

    fetchBoards();
  }, []);

  if (boardsSnapshot.loading) {
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
    <>
      <Collapsible defaultOpen className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton>
              <Kanban />
              <span>Канбан-доска</span>
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
                        <SidebarMenuAction className="text-muted-foreground">
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
