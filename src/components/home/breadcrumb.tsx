"use client";

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

export function HomeBreadcrumb() {
  return (
    <div className="fixed flex w-full border-b z-50 bg-background h-[65px]">
      <Breadcrumb className="flex items-center pl-8 w-full">
        <BreadcrumbList>
          <div className="flex h-4 items-center gap-3 mr-3">
            <SidebarTrigger />
            <Separator className="h-1 min-h-0" orientation="vertical" />
          </div>
          <BreadcrumbItem>
            <BreadcrumbPage className="flex items-center">
              главная
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
