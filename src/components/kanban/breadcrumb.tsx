import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

interface KanbanBreadcrumbProps {
  className?: string;
}

export function KanbanBreadcrumb({ className }: KanbanBreadcrumbProps) {
  return (
    <Breadcrumb
      className={cn(
        "px-[var(--global-px)] pt-6 w-full lg:px-[var(--global-px-lg)] lg:pt-8",
        className
      )}
    >
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
  );
}
