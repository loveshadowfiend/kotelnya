import { Greetings } from "@/components/home/greetings";
import { BoardsAndNotes } from "@/components/home/boards-and-notes";
import { HomeBreadcrumb } from "@/components/home/breadcrumb";

export default function HomePage() {
  return (
    <main className="h-screen w-full">
      <HomeBreadcrumb />
      <div className="flex flex-col h-screen mx-auto w-full items-center">
        <Greetings />
        <BoardsAndNotes variant="boards" />
        <BoardsAndNotes variant="notes" />
      </div>
    </main>
  );
}
