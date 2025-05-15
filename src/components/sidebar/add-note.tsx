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
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSnapshot } from "valtio";
import { Input } from "../ui/input";
import { notesStore } from "@/stores/notes-store";
import { addNote } from "@/api/notes/routes";
import { projectStore } from "@/stores/project-store";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(1, { message: "Введите имя задачи" }),
});

export function AddNote({ children }: { children: React.ReactNode }) {
  const projectSnapshot = useSnapshot(projectStore);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    notesStore.loading = true;

    const response = await addNote(projectSnapshot.project?._id, values.title);

    if (response.ok) {
      const data = await response.json();

      notesStore.notes?.push(data);
      router.push(`/note/${data._id}`);
      toast.success(`Заметка ${values.title} успешно создана`);
    }

    notesStore.loading = false;
  }

  if (notesStore.loading || !projectSnapshot.project) return;

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Добавить заметку</DialogTitle>
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
                    <Input placeholder="Заметка" {...field} />
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
