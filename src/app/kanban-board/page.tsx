import { KanbanBoard } from "@/components/kanban/board";
import { KanbanBreadcrumb } from "@/components/kanban/breadcrumb";

export default function KanbanBoardPage() {
  return (
    <main className="min-h-screen mx-auto space-y-6 gap-6">
      <KanbanBreadcrumb />
      <KanbanBoard />
    </main>
  );
}
