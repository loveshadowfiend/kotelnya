import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useClickOutside } from "@/hooks/use-outside-click";
import { addNewColumn } from "@/proxies/kanban-board-store";
import { kanbanComponentsStore } from "@/proxies/kanban-components-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSnapshot } from "valtio";
import { z } from "zod";
import { Textarea } from "../ui/textarea";
import { createColumn } from "@/api/columns/route";

const formSchema = z.object({
  title: z
    .string()
    .min(1, {
      message: "Название не может быть пустым",
    })
    .max(32, { message: "Название не может быть длиннее 32 символов" }),
});

export function KanbanNewColumn() {
  const [isLoading, setIsLoading] = useState(false);
  const kanbanComponentsSnapshop = useSnapshot(kanbanComponentsStore);
  const ref = useRef<HTMLFormElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    const responseColumn = await createColumn(
      kanbanComponentsSnapshop.boardId,
      values.title
    );

    if (responseColumn.ok) {
      addNewColumn(values.title);
      form.reset();
      kanbanComponentsStore.isAddingCategory = false;
    } else {
      console.log("анлаки");
    }

    // form.setFocus("title");
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
              {isLoading && <Loader2 className="animate-spin" />}
              {!isLoading && "Добавить"}
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
