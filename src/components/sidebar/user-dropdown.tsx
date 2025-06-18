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
import { Image, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeAvatar } from "./change-avatar";
import { useState } from "react";
import { useSnapshot } from "valtio";
import { userStore } from "@/stores/user-store";
import { API_URL } from "@/lib/config";

export function UserDropdown({ children }: { children: React.ReactNode }) {
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const userSnapshot = useSnapshot(userStore);
  const router = useRouter();

  async function logOutHandle() {
    await deleteAuthCookie();

    localStorage.clear();
    router.push("/auth/login");
  }

  if (userSnapshot.user === null) {
    return;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent className="shadow-none w-[240px]">
          <DropdownMenuLabel>мой аккаунт</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setAvatarDialogOpen(true);
            }}
          >
            <Image />
            <span className="truncate">поменять изображение профиля</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={logOutHandle}>
            <LogOut />
            <span>выйти</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ChangeAvatar
        userId={userSnapshot.user._id}
        open={avatarDialogOpen}
        onOpenChange={setAvatarDialogOpen}
        currentAvatar={
          userSnapshot.user.avatarUrl === ""
            ? ""
            : `${API_URL}${userSnapshot.user.avatarUrl}`
        }
      />
    </>
  );
}
