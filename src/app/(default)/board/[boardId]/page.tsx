import { getAuthToken } from "@/lib/auth";

export default async function BoardPage({
  params,
}: {
  params: { boardId: string };
}) {
  const { boardId } = params;
  const fetchBoard = async () => {
    const token = await getAuthToken();
    const response = await fetch(
      `https://103.249.132.70:8443/api/boards/${boardId}`,
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
  const board = await fetchBoard();

  return (
    <div className="flex h-full w-full flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Доска {boardId}</h1>
      {board ? (
        <div>
          <p>Name: {board.name}</p>
          <pre>{JSON.stringify(board, null, 2)}</pre>
        </div>
      ) : (
        <p>Board not found</p>
      )}
    </div>
  );
}
