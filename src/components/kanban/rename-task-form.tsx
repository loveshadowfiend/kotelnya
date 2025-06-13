import { boardStore } from "@/stores/board-store";
import { Task } from "@/types";
import { useSnapshot } from "valtio";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useRef, useState } from "react";
import { kanbanComponentsStore } from "@/stores/kanban-components-store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { updateTask } from "@/api/tasks/route";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { useClickOutside } from "@/hooks/use-outside-click";

const formSchema = z.object({
  title: z
    .string()
    .min(1, {
      message: "Название не может быть пустым",
    })
    .max(64, { message: "Название не может быть длиннее 64 символов" }),
});

interface KanbanRenameTaskProps {
  task: Task;
}

export function KanbanRenameTaskForm({ task }: KanbanRenameTaskProps) {
  const [isLoading, setIsLoading] = useState(false);
  const boardSnapshot = useSnapshot(boardStore);
  const kanbanComponentsSnapshop = useSnapshot(kanbanComponentsStore);
  const ref = useRef<HTMLFormElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: task.title,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const response = await updateTask(task._id, { title: values.title });

    if (!response.ok) {
      toast.error(`не удалось переименовать задачу "${task.title}"`);
    }

    // toast.promise(updateTask(task._id, { title: values.title }), {
    //   loading: "Переименование задачи...",
    //   success: async () => {
    //     boardStore.tasks[task._id].title = values.title;
    //     form.reset();
    //     kanbanComponentsStore.renamingTask = "";
    //     setIsLoading(false);

    //     return `Задача "${values.title}" успешно переименована`;
    //   },
    //   error: "Не удалось переименовать задачу",
    // });
  }

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        kanbanComponentsStore.renamingTask = "";
        form.reset();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useClickOutside(ref as React.RefObject<HTMLElement>, () => {
    if (isLoading) return;

    kanbanComponentsStore.renamingColumn = "";
    if (!form.getValues().title.length) return;

    form.handleSubmit(onSubmit)();
    form.reset();
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-3 my-3"
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
            <span>Сохранить</span>
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              kanbanComponentsStore.renamingTask = "";
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
