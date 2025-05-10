"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { SidebarMenuButton, SidebarMenuSub } from "../ui/sidebar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { addBoard } from "@/api/boards/route";
import { useSnapshot } from "valtio";
import { boardsStore } from "@/stores/boards-store";
import { Input } from "../ui/input";

const formSchema = z.object({
  title: z.string().min(1, { message: "Введите имя задачи" }),
});

export function AddBoard({ children }: { children: React.ReactNode }) {
  const boardSnapshot = useSnapshot(boardsStore);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    boardsStore.loading = true;

    const response = await addBoard("6814eb6af3982bf9826388aa", values.title);

    if (response.ok) {
      const data = await response.json();
      boardsStore.boards?.push(data);
      router.push(`/board/${data._id}`);
    }

    boardsStore.loading = false;
  }

  if (boardsStore.loading) return;

  // if (loading) {
  //   return (
  //     <SidebarMenuSub>
  //       <SidebarMenuButton className="cursor-pointer text-muted-foreground">
  //         <Loader2 className="animate-spin" />
  //         Создание доски...
  //       </SidebarMenuButton>
  //     </SidebarMenuSub>
  //   );
  // }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Добавить доску</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-3 mt-3"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input placeholder="Доска" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">
              <Plus /> Добавить
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
