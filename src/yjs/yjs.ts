// src/yjs/yjs.ts
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

export const createYjsStore = (channel: string) => {
  const ydoc = new Y.Doc();
  const provider = new WebsocketProvider(
    process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:1234",
    channel,
    ydoc
  );

  const ymap = ydoc.getMap("taskStore.v1");

  return { ydoc, ymap, provider };
};
