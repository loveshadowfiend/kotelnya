"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { ru } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { kanbanBoardStore } from "@/proxies/kanbanBoardStore";
import { useSnapshot } from "valtio";
import { useEffect, useState } from "react";

interface DatePicker {
  taskId: string;
  className?: string;
}

export function DatePicker({ taskId, className }: DatePicker) {
  const kanbanBoardSnapshot = useSnapshot(kanbanBoardStore);
  const [date, setDate] = useState<Date>();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    if (kanbanBoardSnapshot.tasks[taskId].dueDate) {
      setDate(new Date(kanbanBoardSnapshot.tasks[taskId].dueDate));
    }
  }, []);

  useEffect(() => {
    if (date == undefined) return;

    kanbanBoardStore.tasks[taskId].dueDate = date.toDateString();
  }, [date]);

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon />
          {date ? (
            format(date, "PPP", { locale: ru })
          ) : (
            <span>Дата дедлайна</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            if (selectedDate) {
              setDate(selectedDate);
              setIsPopoverOpen(false);
            }
          }}
          locale={ru}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
