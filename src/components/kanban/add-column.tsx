import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useClickOutside } from "@/hooks/use-outside-click";
import { addNewColumn, boardStore } from "@/stores/board-store";
import { kanbanComponentsStore } from "@/stores/kanban-components-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSnapshot } from "valtio";
import { z } from "zod";
import { Textarea } from "../ui/textarea";
import { createColumn } from "@/api/columns/route";
import { toast } from "sonner";

const formSchema = z.object({
  title: z
    .string()
    .min(1, {
      message: "Название не может быть пустым",
    })
    .max(32, { message: "Название не может быть длиннее 32 символов" }),
});

export function KanbanAddColumn() {
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

    toast.promise(createColumn(boardSnapshot._id, values.title), {
      loading: "Создание задачи...",
      success: async (response) => {
        const newColumn = await response.json();
        addNewColumn(newColumn._id, values.title);
        form.reset();
        kanbanComponentsStore.isAddingCategory = false;

        return `Список "${values.title}" успешно создан`;
      },
      error: "Не удалось создать список",
    });

    setIsLoading(false);
  }

  useClickOutside(ref as React.RefObject<HTMLElement>, () => {
    if (isLoading) return;

    kanbanComponentsStore.isAddingCategory = false;

    if (!form.getValues().title.length) return;

    form.handleSubmit(onSubmit)();
    form.reset();
  });

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        kanbanComponentsStore.isAddingCategory = false;
        form.reset();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  if (kanbanComponentsSnapshop.isAddingCategory) {
    return (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-3 h-fit "
          ref={ref}
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    className="
                    rounded-xl resize-none w-[80vw] ring-inset px-6 py-6 field-sizing-content font-semibold text-sm mr-[20px]
                    lg:w-[20vw]
                    "
                    placeholder="Название списка"
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
              Добавить
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                kanbanComponentsStore.isAddingCategory = false;
                form.reset();
              }}
              disabled={isLoading}
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
      className="bg-muted/60 w-[80vw] h-10 lg:w-[20vw]"
      variant={"ghost"}
      onClick={() => {
        kanbanComponentsStore.isAddingCategory = true;
      }}
    >
      <Plus />
      <span>Добавить список</span>
    </Button>
  );
}
