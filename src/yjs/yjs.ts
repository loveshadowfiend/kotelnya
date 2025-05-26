// src/yjs/yjs.ts
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

export const createYjsStore = (channel: string) => {
  const ydoc = new Y.Doc();
  const provider = new WebsocketProvider(
    "ws://103.249.132.70:1234",
    channel,
    ydoc
  );

  const ymap = ydoc.getMap("taskStore.v1");

  return { ydoc, ymap, provider };
};
