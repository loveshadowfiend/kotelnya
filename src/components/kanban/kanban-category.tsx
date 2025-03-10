"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CirclePlus, GripVertical } from "lucide-react";
import { Button } from "../ui/button";
import { KanbanTask } from "./kanban-task";
import { TaskDialog } from "./task-dialog";

export function KanbanCategory(props: { title: string }) {
  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-center text-sm gap-2">
        <Button variant={"ghost"}>
          <GripVertical />
        </Button>
        <CardTitle>{props.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <KanbanTask title="помыть посуду" description="хз помой посуду лооол" />
        <KanbanTask title="сделать домашку" description="математика и физика" />
        <TaskDialog>
          <Button variant={"ghost"}>
            <CirclePlus width={15} height={15} />
            Добавить задачу
          </Button>
        </TaskDialog>
      </CardContent>
    </Card>
  );
}
