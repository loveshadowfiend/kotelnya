"use client";

import { KanbanCategory } from "./kanban-category";

export function KanbanBoard() {
  return (
    <div className="grid md:grid-cols-5 md:gap-3 2xl:grid-cols-6">
      <KanbanCategory title="Запланированное" />
    </div>
  );
}
