import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";

interface KanbanBreadcrumbProps {
  className?: string;
}

export function KanbanBreadcrumb({ className }: KanbanBreadcrumbProps) {
  return (
    <div
      className={cn(
        "flex items-center h-12 gap-3 px-[var(--global-px)] pt-6 lg:px-[var(--global-px-lg)] lg:pt-8",
        className
      )}
    >
      <SidebarTrigger />
      <Separator orientation="vertical" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Главная</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Канбан-доска</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
