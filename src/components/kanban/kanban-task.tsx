import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function KanbanTask(props: { title: string; description: string }) {
  return (
    <Card className="shadow-none py-3 text-sm w-full">
      <CardHeader className="px-4 gap-3">
        <CardTitle>{props.title}</CardTitle>
        <CardDescription>{props.description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
