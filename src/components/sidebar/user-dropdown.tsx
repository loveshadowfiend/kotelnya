"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteAuthCookie } from "@/lib/auth";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export function UserDropdown({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  async function logOutHandle() {
    await deleteAuthCookie();

    router.push("/auth/login");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="shadow-none w-[240px]">
        <DropdownMenuLabel>Мой аккаунт</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logOutHandle}>
          <LogOut />
          <span>Выйти</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
