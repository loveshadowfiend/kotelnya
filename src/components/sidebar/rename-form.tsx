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
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { SetStateAction } from "react";
import { updateBoard } from "@/api/boards/route";
import { useSnapshot } from "valtio";
import { boardsStore } from "@/stores/boards-store";
import { notesStore } from "@/stores/notes-store";
import { updateNote } from "@/api/notes/routes";

const formSchema = z.object({
  title: z.string().min(1, { message: "введите имя доски" }),
});

interface SidebarRenameFormProps {
  boardId?: string;
  noteId?: string;
  title: string;
  setIsRenaming: React.Dispatch<SetStateAction<boolean>>;
}

export function SidebarRenameForm({
  boardId,
  noteId,
  title,
  setIsRenaming,
}: SidebarRenameFormProps) {
  const boardsSnapshot = useSnapshot(boardsStore);
  const notesSnapshot = useSnapshot(notesStore);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: title,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (boardId && boardsStore.boards) {
      const newBoard = boardsStore.boards.filter(
        (board) => board._id === boardId
      )[0];

      newBoard.title = values.title;
      updateBoard(boardId, newBoard);
    } else if (noteId && notesStore.notes) {
      const newNote = notesStore.notes.filter((note) => note._id === noteId)[0];

      newNote.title = values.title;
      updateNote(noteId, newNote);
    }

    setIsRenaming(false);
  }

  return (
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
              <FormControl>
                <Input placeholder="доска" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">сохранить</Button>
      </form>
    </Form>
  );
}
