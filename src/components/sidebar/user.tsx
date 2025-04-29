import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { verifyAuth } from "@/lib/auth";
import { User } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserDropdown } from "./user-dropdown";

export async function SidebarUser() {
  const user: User = await getUser();

  async function getUser() {
    const payload = await verifyAuth();

    if (!payload) {
      return;
    }

    const response = await fetch(
      `http://103.249.132.70:9001/api/users/${payload.id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${payload.token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    return data;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <UserDropdown>
          <SidebarMenuButton size="lg">
            <Avatar className="rounded-lg">
              <AvatarImage src={user.avatarUrl} />
              <AvatarFallback className="rounded-lg">
                {user.username.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col justify-center">
              <span>{user.username}</span>
              <span className="text-muted-foreground">{user.email}</span>
            </div>
          </SidebarMenuButton>
        </UserDropdown>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
