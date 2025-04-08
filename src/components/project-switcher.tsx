import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronsUpDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function ProjectSwitcher() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              className="flex justify-between max-w-full"
              size="lg"
            >
              <div className="flex items-center gap-2">
                <Avatar className="rounded-lg">
                  <AvatarImage src="https://i.pinimg.com/474x/8e/71/23/8e7123bec0b1105340b311d51a3ef03d.jpg" />
                  <AvatarFallback />
                </Avatar>
                <div className="flex flex-col">
                  <p className="font-medium">slime momonga</p>
                  <p className="text-muted-foreground overflow-hidden truncate">
                    haiiii ^-^
                  </p>
                </div>
              </div>
              <ChevronsUpDown />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start"></DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
