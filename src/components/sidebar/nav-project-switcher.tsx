"use client";

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
import { ChevronsUpDown, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AddProject } from "./add-project";
import { getAuthToken, verifyAuth } from "@/lib/auth";
import { Project } from "@/types";
import { useEffect, useState } from "react";
import { NavCurrentProject } from "./nav-current-project";

export function NavProjectSwitcher() {
  const [data, setData] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      const payload = await verifyAuth();
      const token = await getAuthToken();

      if (payload === null) {
        return;
      }

      const userId = payload.id;
      const response = await fetch(
        `http://103.249.132.70:9001/api/users/${userId}/projects`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}}`,
            "Content-Type": "application/json",
          },
        }
      );

      const json = await response.json();

      if (response.ok) {
        setData(json);
      } else {
        setError(json.message ?? "Ошибка при получении проектов");
      }

      setLoading(false);
    };

    fetchProjects();
  }, []);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              className="flex justify-between max-w-full"
              size="lg"
            >
              <NavCurrentProject />
              <ChevronsUpDown />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="relative w-60" align="center">
            <DropdownMenuLabel>Проекты</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {loading && (
              <div className="flex items-center justify-center overflow-hidden py-3">
                <Loader2 className="animate-spin" />
              </div>
            )}
            {!loading &&
              data.map((project: Project) => {
                return (
                  <div
                    key={project._id}
                    className="flex items-center gap-2 p-2 hover:bg-muted cursor-pointer rounded-sm h-fit"
                  >
                    <Avatar className="rounded-lg">
                      <AvatarImage src="" />
                      <AvatarFallback className="rounded-lg">
                        {project.title.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm">{project.title}</p>
                      <p className="text-sm text-muted-foreground overflow-hidden truncate">
                        {project.status}
                      </p>
                    </div>
                  </div>
                );
              })}
            {!loading && (
              <AddProject>
                <div className="flex items-center gap-2 p-2 hover:bg-muted cursor-pointer rounded-sm h-fit">
                  <Avatar className="rounded-lg">
                    <AvatarFallback className="rounded-lg">+</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground font-medium">
                    Добавить проект
                  </span>
                </div>
              </AddProject>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
