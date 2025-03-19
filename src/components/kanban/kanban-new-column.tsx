import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function KanbanNewColumn() {
  return (
    <Button className="bg-muted/80 h-10" variant={"ghost"}>
      <Plus />
      <span>Добавить список</span>
    </Button>
  );
}
