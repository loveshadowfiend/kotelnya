import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronsUpDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function SidebarProjectSwitcher() {
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
                  <AvatarFallback className="rounded-lg">PR</AvatarFallback>
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
          <DropdownMenuContent className="relative w-60" align="center">
            <DropdownMenuLabel>Проекты</DropdownMenuLabel>
            <div className="flex items-center gap-2 p-2 hover:bg-muted cursor-pointer rounded-sm h-fit">
              <Avatar className="rounded-lg">
                <AvatarImage src="https://i.pinimg.com/474x/8e/71/23/8e7123bec0b1105340b311d51a3ef03d.jpg" />
                <AvatarFallback />
              </Avatar>
              <div className="flex flex-col">
                <p className="text-sm">slime momonga</p>
                <p className="text-sm text-muted-foreground overflow-hidden truncate">
                  haiiii ^-^
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <div className="flex items-center gap-2 p-2 hover:bg-muted cursor-pointer rounded-sm h-fit">
              <Avatar className="rounded-lg">
                <AvatarFallback className="rounded-lg">+</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground font-medium">
                Добавить проект
              </span>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
