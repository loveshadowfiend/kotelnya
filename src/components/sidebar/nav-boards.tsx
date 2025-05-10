"use client";

import Link from "next/link";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuSubItem,
} from "../ui/sidebar";
import { getAuthToken } from "@/lib/auth";
import { Ellipsis, Loader2 } from "lucide-react";
import { BoardDropdown } from "./board-dropdown";
import { useEffect } from "react";
import { boardsStore } from "@/proxies/boards-store";
import { useSnapshot } from "valtio";
import { Skeleton } from "../ui/skeleton";

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
        {[...Array(2)].map((_, idx) => (
          <SidebarMenuSubItem className="text-muted-foreground" key={idx}>
            <SidebarMenuButton>
              <Skeleton className="w-60 h-6" />
            </SidebarMenuButton>
          </SidebarMenuSubItem>
        ))}
      </>
    );
  }

  return (
    <>
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
              <BoardDropdown boardId={board._id} boardTitle={board.title}>
                <SidebarMenuAction className="text-muted-foreground">
                  <Ellipsis /> <span className="sr-only">Еще</span>
                </SidebarMenuAction>
              </BoardDropdown>
            </SidebarMenuSubItem>
          );
        })}
    </>
  );
}
