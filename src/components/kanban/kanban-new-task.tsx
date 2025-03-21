import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Plus, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "../ui/input";
import { addNewTask } from "@/proxies/kanbanBoardStore";
import { KanbanColumn } from "@/types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSnapshot } from "valtio";
import { kanbanComponentsStore } from "@/proxies/kanbanComponentsStore";

const formSchema = z.object({
  title: z
    .string()
    .min(1, {
      message: "Название не может быть пустым",
    })
    .max(32, { message: "Название не может быть длиннее 32 символов" }),
  description: z.string().min(0).max(256, {
    message: "Описание не может быть длиннее 256 символов",
  }),
});

interface KanbanNewTaskProps {
  column: KanbanColumn;
  isDialogOpen: boolean;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
}

export function KanbanNewTask({
  column,
  isDialogOpen,
  setIsDialogOpen,
}: KanbanNewTaskProps) {
  const kanbanComponentsSnapshop = useSnapshot(kanbanComponentsStore);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addNewTask(column.id, values.title);
    form.reset();
    form.setFocus("title");
    setIsDialogOpen(false);
  }

  if (kanbanComponentsSnapshop.addNewTaskActiveColumn == column.id) {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
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
            <Button type="submit">Сохранить</Button>
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
        kanbanComponentsStore.addNewTaskActiveColumn = column.id;
        console.log(column.id);
      }}
    >
      <Plus />
      Добавить задачу
    </Button>
  );

  // return (
  //   <Form {...form}>
  //     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
  //       <FormField
  //         control={form.control}
  //         name="title"
  //         render={({ field }) => (
  //           <FormItem>
  //             <FormControl>
  //               <Input placeholder="Название задачи" {...field} />
  //             </FormControl>
  //             <FormMessage />
  //           </FormItem>
  //         )}
  //       />
  //       <Button type="submit">Сохранить</Button>
  //     </form>
  //   </Form>

  // <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
  //   <DialogTrigger asChild>
  //     <Button variant="ghost" className="w-full justify-center h-10 text-sm">
  //       <Plus className="mr-2 h-4 w-4" />
  //       Добавить задачу
  //     </Button>
  //   </DialogTrigger>
  //   <DialogContent>
  //     <DialogHeader>
  //       <DialogTitle>Новая задача</DialogTitle>
  //     </DialogHeader>
  //     <Form {...form}>
  //       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
  //         <FormField
  //           control={form.control}
  //           name="title"
  //           render={({ field }) => (
  //             <FormItem>
  //               <FormControl>
  //                 <Input placeholder="Название задачи" {...field} />
  //               </FormControl>
  //               <FormMessage />
  //             </FormItem>
  //           )}
  //         />
  //         <FormField
  //           control={form.control}
  //           name="description"
  //           render={({ field }) => (
  //             <FormItem>
  //               <FormControl>
  //                 <Input placeholder="Описание" {...field} />
  //               </FormControl>
  //               <FormMessage />
  //             </FormItem>
  //           )}
  //         />
  //         <Button type="submit">Сохранить</Button>
  //       </form>
  //     </Form>
  //   </DialogContent>
  // </Dialog>
  // );
}
