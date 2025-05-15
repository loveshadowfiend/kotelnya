import { Board, BoardModified } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert to more friendly object format for the board
export function modifyBoardObject(board: Board) {
  const newBoard: BoardModified = {
    ...board,
    tasks: Object.fromEntries(
      board.tasks.map((task) => [
        task._id,
        {
          _id: task._id,
          title: task.title,
          assignee: task.assignee,
          description: task.description,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
          __v: task.__v,
        },
      ])
    ),
    columns: Object.fromEntries(
      board.columns.map((column) => [
        column._id,
        {
          _id: column._id,
          title: column.title,
          tasks: column.tasks,
          createdAt: column.createdAt,
          updatedAt: column.updatedAt,
          __v: column.__v,
        },
      ])
    ),
  };

  return newBoard;
}

// Convert to MongoDB-style
export function unmodifyBoardObject(board: BoardModified) {
  const newBoard: Board = {
    ...board,
    tasks: Object.values(board.tasks).map((task) => ({
      ...task,
      _id: task._id,
    })),
    columns: Object.values(board.columns).map((column) => ({
      ...column,
      _id: column._id,
    })),
  };

  return newBoard;
}
