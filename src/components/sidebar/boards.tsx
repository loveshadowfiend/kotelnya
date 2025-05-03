import Link from "next/link";
import { SidebarMenuButton } from "../ui/sidebar";
import { getAuthToken } from "@/lib/auth";
import { Board } from "@/types";

export async function SidebarBoards() {
  const fetchBoards = async () => {
    const token = await getAuthToken();
    const response = await fetch(
      "https://103.249.132.70:8443/api/projects/6814eb6af3982bf9826388aa/boards",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      return null;
    }
  };
  const boards = await fetchBoards();

  return (
    <>
      {boards &&
        boards.map((board: Board) => {
          return (
            <SidebarMenuButton key={board._id} asChild>
              <Link href={`/board/${board._id}`}>{board._id}</Link>
            </SidebarMenuButton>
          );
        })}
    </>
  );
}
