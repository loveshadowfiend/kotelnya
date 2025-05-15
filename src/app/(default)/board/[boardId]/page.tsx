import { KanbanBoard } from "@/components/kanban/board";
import { KanbanBreadcrumb } from "@/components/kanban/breadcrumb";

export default async function BoardPage({
  params,
}: {
  params: { boardId: string };
}) {
  const { boardId } = await params;

  return (
    <main className="min-h-screen space-y-6 gap-6">
      <KanbanBreadcrumb boardId={boardId} />
      <KanbanBoard boardId={boardId} />
    </main>
  );
}
