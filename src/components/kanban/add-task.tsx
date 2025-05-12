import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "../ui/button";
import { Loader2, Plus, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { addNewTask, boardStore } from "@/stores/board-store";
import { Column } from "@/types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSnapshot } from "valtio";
import { kanbanComponentsStore } from "@/stores/kanban-components-store";
import { useClickOutside } from "@/hooks/use-outside-click";
import { useEffect, useRef, useState } from "react";
import { addTask } from "@/api/tasks/route";

const formSchema = z.object({
  title: z
    .string()
    .min(1, {
      message: "Название не может быть пустым",
    })
    .max(32, { message: "Название не может быть длиннее 32 символов" }),
});

interface KanbanNewTaskProps {
  column: Column;
}

export function KanbanAddTask({ column }: KanbanNewTaskProps) {
  const [isLoading, setIsLoading] = useState(false);
  const kanbanComponentsSnapshop = useSnapshot(kanbanComponentsStore);
  const boardSnapshot = useSnapshot(boardStore);
  const ref = useRef<HTMLFormElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const response = await addTask(column._id, boardSnapshot._id, values.title);

    if (response.ok) {
      const newTask = await response.json();
      addNewTask(newTask._id, column._id, values.title);
      form.reset();
      // form.setFocus("title");
      kanbanComponentsStore.addNewTaskActiveColumn = "";
    } else {
      console.log("анлаки");
    }

    setIsLoading(false);
  }

  useClickOutside(ref as React.RefObject<HTMLElement>, () => {
    kanbanComponentsStore.addNewTaskActiveColumn = "";

    if (!form.getValues().title.length) return;

    form.handleSubmit(onSubmit)();
    form.reset();
  });

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        kanbanComponentsStore.addNewTaskActiveColumn = "";
        form.reset();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  if (kanbanComponentsSnapshop.addNewTaskActiveColumn == column._id) {
    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-3"
          ref={ref}
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    className="rounded-xl px-6 py-6 resize-none field-sizing-content"
                    placeholder="Название задачи"
                    {...field}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        form.handleSubmit(onSubmit)();
                      }
                    }}
                    onBlur={() => {
                      form.setFocus("title");
                    }}
                    autoFocus
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-1">
            <Button type="submit" disabled={isLoading}>
              {!isLoading && <span>Сохранить</span>}
              {isLoading && <Loader2 className="animate-spin" />}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                kanbanComponentsStore.addNewTaskActiveColumn = "";
                form.reset();
              }}
            >
              <X />
            </Button>
          </div>
        </form>
      </Form>
    );
  }

  return (
    <Button
      className="w-full"
      variant="ghost"
      onClick={() => {
        kanbanComponentsStore.addNewTaskActiveColumn = column._id;
      }}
    >
      <Plus />
      Добавить задачу
    </Button>
  );
}
