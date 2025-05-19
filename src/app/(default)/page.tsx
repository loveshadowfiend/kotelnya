import { Greetings } from "@/components/home/greetings";
import { BoardsAndNotes } from "@/components/home/boards-and-notes";

export default function HomePage() {
  return (
    <main className="flex flex-col h-screen mx-auto w-[66%] items-center">
      <Greetings />
      <BoardsAndNotes variant="boards" />
      <BoardsAndNotes variant="notes" />
    </main>
  );
}
