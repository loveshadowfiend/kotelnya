"use client";

import { Loader2, Plus } from "lucide-react";
import { SidebarMenuButton } from "../ui/sidebar";
import { getAuthToken } from "@/lib/auth";
import { useState } from "react";

export function AddBoard() {
  const [loading, setLoading] = useState(false);

  async function onClick() {
    setLoading(true);

    const token = await getAuthToken();
    const response = await fetch(
      "http://103.249.132.70:9001/api/projects/6814eb6af3982bf9826388aa/boards",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();

    data;

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
    <SidebarMenuButton className="cursor-pointer" onClick={onClick}>
      <Plus />
      Добавить доску
    </SidebarMenuButton>
  );
}
