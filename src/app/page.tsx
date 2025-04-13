import { Kanban, Notebook, Target } from "lucide-react";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";

const features = [
  {
    Icon: Kanban,
    name: "Канбан-доска",
    description: "Управляйте задачами с помощью Канбан-доски",
    href: "/kanban-board",
    cta: "Открыть",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: Notebook,
    name: "Заметки",
    description: "Создавайте и управляйте заметками",
    href: "/note",
    cta: "Открыть",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: Target,
    name: "Проекты",
    description: "Управляйте проектами и задачами",
    href: "/projects",
    cta: "Открыть",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col gap-10 h-screen items-center justify-center mx-auto">
      <span className="font-bold text-4xl">zaloopa</span>
      <BentoGrid className="lg:grid-rows-3 lg:grid-cols-2">
        {features.map((feature) => (
          <BentoCard key={feature.name} {...feature} />
        ))}
      </BentoGrid>
    </div>
  );
}
