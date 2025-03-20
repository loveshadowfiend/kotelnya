import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function KanbanNewColumn() {
  return (
    <Button
      className="bg-muted/60 h-10 lg:w-[20vw] mr-[20px]"
      variant={"ghost"}
    >
      <Plus />
      <span>Добавить список</span>
    </Button>
  );
}
