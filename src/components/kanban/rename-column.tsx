import { Check, Save } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { boardStore } from "@/stores/board-store";
import { kanbanComponentsStore } from "@/stores/kanban-components-store";
import { useRef, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useClickOutside } from "@/hooks/use-outside-click";
import { updateColumn } from "@/api/columns/route";

const formSchema = z.object({
  title: z
    .string()
    .min(1, {
      message: "название не может быть пустым",
    })
    .max(32, { message: "название не может быть длиннее 16 символов" }),
});

interface KanbanRenameColumnProps {
  columnId: string;
}

export function KanbanRenameColumn({ columnId }: KanbanRenameColumnProps) {
  const ref = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: boardStore.columns[columnId].title,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    boardStore.columns[columnId].title = values.title;
    kanbanComponentsStore.renamingColumn = "";
    updateColumn(columnId, values.title);
  };

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

  useClickOutside(ref as React.RefObject<HTMLElement>, () => {
    kanbanComponentsStore.renamingColumn = "";
    if (!form.getValues().title.length) return;

    form.handleSubmit(onSubmit)();
    form.reset();
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex justify-between items-center w-full gap-2"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  className="text-md rounded-full w-full font-normal h-5 m-0 px-3 py-4.25"
                  {...field}
                  type="text"
                  ref={ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="ghost">
          <Check />
        </Button>
      </form>
    </Form>
  );
}
