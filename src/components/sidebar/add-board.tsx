"use client";

import { Loader2, Plus } from "lucide-react";
import { SidebarMenuButton } from "../ui/sidebar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { addBoard } from "@/api/boards/route";
import { useSnapshot } from "valtio";
import { boardsStore } from "@/proxies/boards-store";

export function AddBoard() {
  const boardSnapshot = useSnapshot(boardsStore);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onClick() {
    setLoading(true);

    const response = await addBoard("6814eb6af3982bf9826388aa");

    if (response.ok) {
      const data = await response.json();
      boardsStore.boards.push(data);
      router.push(`/board/${data._id}`);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <SidebarMenuButton className="cursor-pointer">
        <Loader2 className="animate-spin" />
        Создание доски...
      </SidebarMenuButton>
    );
  }

  return (
    <SidebarMenuButton
      className="text-muted-foreground cursor-pointer"
      onClick={onClick}
    >
      <Plus />
      Добавить доску
    </SidebarMenuButton>
  );
}
