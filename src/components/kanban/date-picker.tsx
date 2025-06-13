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
import { boardStore } from "@/stores/board-store";
import { useSnapshot } from "valtio";
import { useEffect, useState } from "react";
import { updateTask } from "@/api/tasks/route";

interface DatePicker {
  taskId: string;
  className?: string;
}

export function DatePicker({ taskId, className }: DatePicker) {
  const boardSnapshot = useSnapshot(boardStore);
  const [date, setDate] = useState<Date>();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    if (boardSnapshot.tasks[taskId].dueDate) {
      setDate(new Date(boardSnapshot.tasks[taskId].dueDate));
    }
  }, []);

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
              boardStore.tasks[taskId].dueDate = selectedDate.toISOString();
              updateTask(taskId, {
                dueDate: selectedDate.toISOString(),
              });
            }
          }}
          locale={ru}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
