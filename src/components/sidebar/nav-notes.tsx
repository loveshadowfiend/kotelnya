import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "../ui/collapsible";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuAction,
} from "../ui/sidebar";
import { BookHeart, Plus } from "lucide-react";
import Link from "next/link";

export function NavNotes() {
  return (
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            <BookHeart />
            <span>Заметки</span>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <SidebarMenuAction>
          <Plus /> <span className="sr-only">Добавить заметку</span>
        </SidebarMenuAction>
        <CollapsibleContent>
          <SidebarMenuSub>
            <SidebarMenuSubItem className="text-muted-foreground">
              <SidebarMenuButton asChild>
                <Link href="/note">
                  <span>test note</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuSubItem>
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
