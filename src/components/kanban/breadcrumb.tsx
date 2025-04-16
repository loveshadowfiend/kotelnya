import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";

export function KanbanBreadcrumb() {
  return (
    <div className="flex justify-between w-full">
      <Breadcrumb className="flex items-center h-[65px] pl-8 w-full border-b">
        <BreadcrumbList>
          <div className="flex h-4 items-center gap-3 mr-3">
            <SidebarTrigger />
            <Separator className="h-1 min-h-0" orientation="vertical" />
          </div>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Главная</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Канбан-доска</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Моя доска</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
