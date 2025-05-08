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
      <SidebarMenuSubItem className="text-muted-foreground">
        <SidebarMenuButton>
          <Loader2 className="animate-spin" />
        </SidebarMenuButton>
      </SidebarMenuSubItem>
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
              <SidebarMenuButton className="w-40 truncate" asChild>
                <Link href={`/board/${board._id}`}>{board._id}</Link>
              </SidebarMenuButton>
              <BoardDropdown boardId={board._id} boardTitle={board._id}>
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
