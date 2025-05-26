// src/yjs/useSyncToYjsEffect.ts
import { useEffect } from "react";
import { bind } from "valtio-yjs";
import { boardStore } from "@/stores/board-store";
import { createYjsStore } from "./yjs";

export const useSyncToYjsEffect = (boardId: string) => {
  useEffect(() => {
    const { ymap, provider } = createYjsStore(`board-${boardId}`);

    const unbind = bind(boardStore, ymap);

    return () => {
      unbind();
      provider.disconnect();
    };
  }, [boardId]);
};
