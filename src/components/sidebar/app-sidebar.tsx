import { Cat, Settings, Archive, Users } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavProjects } from "./nav-projects";
import Link from "next/link";
import { NavUser } from "./nav-user";
import { NavBoards } from "./nav-boards";
import { NavNotes } from "./nav-notes";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <NavProjects />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/">
                    <Cat />
                    <span>Главная</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/* <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="#">
                    <Settings />
                    <span>Настройки</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem> */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/members">
                    <Users />
                    <span>Участники</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Рабочее пространство</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <NavBoards />
            </SidebarMenu>
            <SidebarMenu>
              <NavNotes />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
