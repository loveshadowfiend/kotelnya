import { NoteBreadcrumb } from "@/components/note/breadcrumb";
import { Editor } from "@/components/note/editor/editor";

export default async function NotePage({
  params,
}: {
  params: { noteId: string };
}) {
  const { noteId } = await params;

  return (
    <main className="w-full">
      <NoteBreadcrumb noteId={noteId} />
      <Editor noteId={noteId} />
    </main>
  );
}
