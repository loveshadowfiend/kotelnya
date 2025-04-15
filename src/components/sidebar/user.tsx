import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function SidebarUser() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg">
          <Avatar className="rounded-lg">
            <AvatarImage src="https://i.pinimg.com/736x/78/eb/17/78eb1762c0f5cf34d12c39182dde9d1a.jpg" />
            <AvatarFallback className="rounded-lg">US</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span>usagi</span>
            <span className="text-muted-foreground">usagi@dvfu.ru</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
