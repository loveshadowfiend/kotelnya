"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addProject } from "@/stores/projects-store";
import { useMediaQuery } from "react-responsive";
import { Plus } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(1, { message: "введите имя проекта" }),
  status: z.string().max(32, { message: "" }),
});

export function AddProject({ children }: { children: React.ReactNode }) {
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      status: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await addProject(values.title, values.status);
  }

  return (
    <Drawer direction={isTabletOrMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>добавить проект</DrawerTitle>
        </DrawerHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-3 mt-3 mx-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>название</FormLabel>
                  <FormControl>
                    <Input placeholder="проект" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>статус</FormLabel>
                  <FormControl>
                    <Input placeholder="в процессе" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">
              <Plus /> добавить
            </Button>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  );
}
