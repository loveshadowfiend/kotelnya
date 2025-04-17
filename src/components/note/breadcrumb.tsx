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

export function NoteBreadcrumb() {
  return (
    <div className="fixed flex justify-between w-full bg-background z-50 border-b">
      <Breadcrumb className="flex items-center h-[64px] px-[var(--global-px)] w-full lg:px-[var(--global-px-lg)]">
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
            <BreadcrumbLink href="/">Заметки</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Моя заметка</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
