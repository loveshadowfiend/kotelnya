"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { verifyAuth } from "@/lib/auth";
import { UserDropdown } from "./user-dropdown";
import { useEffect } from "react";
import { getUser } from "@/api/users/route";
import { useRouter } from "next/navigation";
import { useSnapshot } from "valtio";
import { userStore } from "@/stores/user-store";
import { Skeleton } from "../ui/skeleton";
import { API_URL } from "@/lib/config";

export function NavUser() {
  const userSnapshot = useSnapshot(userStore);
  const router = useRouter();

  useEffect(() => {
    async function fetchAndSetUser() {
      userStore.loading = true;

      const payload = await verifyAuth();

      if (!payload) {
        router.push("/auth/login");

        return;
      }

      const response = await getUser((payload as { id: string }).id);

      if (response.ok) {
        const user = await response.json();
        userStore.user = user;
      }

      userStore.loading = false;
    }

    fetchAndSetUser();
  }, []);

  if (!userSnapshot.user) return <Skeleton className="w-60 h-12 " />;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <UserDropdown>
          <SidebarMenuButton size="lg">
            <Avatar className="rounded-lg">
              <AvatarImage src={`${API_URL}${userSnapshot.user.avatarUrl}`} />
              <AvatarFallback className="rounded-lg text-muted-foreground">
                {userSnapshot.user.username.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col justify-center">
              <span>{userSnapshot.user.username}</span>
              <span className="text-muted-foreground">
                {userSnapshot.user.email}
              </span>
            </div>
          </SidebarMenuButton>
        </UserDropdown>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
