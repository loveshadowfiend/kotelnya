import { proxy } from "valtio";
import { BoardsState } from "@/types";
import { deleteBoard as deleteBoardApi } from "@/api/boards/route";
import { addBoard as addBoardApi } from "@/api/boards/route";

export const boardsStore = proxy<BoardsState>();

export const deleteBoard = async (boardId: string) => {
  boardsStore.loading = true;

  const response = await deleteBoardApi(boardId);

  if (response.ok) {
    const newBoards = boardsStore.boards.filter(
      (board) => board._id !== boardId
    );
    boardsStore.boards = newBoards;
  }

  boardsStore.loading = false;
};

export const addBoard = async (projectId: string) => {
  boardsStore.loading = true;

  const response = await addBoardApi(projectId);

  if (response.ok) {
    const data = await response.json();
    boardsStore.boards.push(data);
  }

  boardsStore.loading = false;
};
