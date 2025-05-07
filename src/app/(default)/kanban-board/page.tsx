import { KanbanBoard } from "@/components/kanban/board";
import { KanbanBreadcrumb } from "@/components/kanban/breadcrumb";
import { kanbanSample } from "@/constants";

export default function KanbanBoardPage() {
  return (
    <main className="min-h-screen space-y-6 gap-6">
      <KanbanBreadcrumb />
      <KanbanBoard boardId="" />
    </main>
  );
}
