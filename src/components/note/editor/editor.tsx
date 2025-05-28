"use client";

import { theme } from "./theme";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { LinkNode, AutoLinkNode } from "@lexical/link";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { $convertFromMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { FloatingMenuPlugin } from "./plugins/floating-menu-plugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import CodeHighlightPlugin from "./plugins/code-highlight-plugin";
import DraggableBlockPlugin from "./plugins/draggable-block-plugin";
import { useCallback, useEffect, useRef, useState } from "react";
import ComponentPickerMenuPlugin from "./plugins/component-picker-plugin";
import MarkdownIoPlugin from "./plugins/markdown-io-plugin";
import { useSnapshot } from "valtio";
import { noteStore } from "@/stores/note-store";
import { getNote } from "@/api/notes/routes";
import LexicalAutoLinkPlugin from "./plugins/auto-link-plugin";
import { ClickableLinkPlugin } from "@lexical/react/LexicalClickableLinkPlugin";
import { CollaborationPlugin } from "@lexical/react/LexicalCollaborationPlugin";
import { WebsocketProvider } from "y-websocket";
import { userStore } from "@/stores/user-store";
import { Skeleton } from "@/components/ui/skeleton";
import { Doc } from "yjs";

function onError(error: any) {
  console.error(error);
}

interface EditorProps {
  noteId: string;
}

export function Editor({ noteId }: EditorProps) {
  const initialConfig = {
    namespace: `kotelnya-editor-${noteId}`,
    editorState: null,
    theme,
    onError,
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      HorizontalRuleNode,
      LinkNode,
      CodeNode,
      CodeHighlightNode,
      AutoLinkNode,
    ],
  };
  const [isLoading, setIsLoading] = useState(true);
  const [isSynced, setIsSynced] = useState(false);
  const noteSnapshot = useSnapshot(noteStore);
  const userSnapshot = useSnapshot(userStore);
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);
  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  const providerFactory = (id: string, yjsDocMap: Map<string, Doc>) => {
    let doc = null;

    if (!yjsDocMap.has(id)) {
      doc = new Doc();
      yjsDocMap.set(id, doc);
    } else {
      doc = yjsDocMap.get(id)!;
    }

    // Create new provider
    const provider = new WebsocketProvider(
      process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:1234",
      id,
      doc
    );

    provider.on("status", (event) => {
      if (event.status === "connected") {
        console.log(`Connected to Yjs provider for note ${id}`);
      } else if (event.status === "disconnected") {
        console.log(`Disconnected from Yjs provider for note ${id}`);
      }
    });

    provider.on("sync", (synced: boolean) => {
      console.log(`Yjs synced: ${synced} for note ${id}`);
      setIsSynced(synced);
    });

    provider.on("connection-error", (event) => {
      console.log("Connection error:", event);
    });

    provider.on("connection-close", (event) => {
      console.log("Connection closed:", event);
    });

    return provider;
  };

  useEffect(() => {
    const fetchAndSetNote = async () => {
      setIsLoading(true);

      const response = await getNote(noteId);

      if (response.ok) {
        const noteData = await response.json();

        noteStore.note = noteData;
      }

      setIsLoading(false);
    };

    fetchAndSetNote();
  }, [noteId]);

  useEffect(() => {
    noteStore.note = null;
  }, []);

  if (
    !noteSnapshot.note ||
    (noteSnapshot.note && noteSnapshot.note._id !== noteId) ||
    userSnapshot.user === null
  ) {
    return <EditorSkeleton />;
  }

  return (
    <LexicalComposer key={noteId} initialConfig={initialConfig}>
      {isSynced && (
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className="focus:outline-none pt-20 px-10 mx-auto max-w-full min-h-screen lg:py-32 lg:px-40 relative"
              aria-placeholder="Введите текст или '/' для комманд"
              placeholder={
                <div className="text-muted-foreground absolute pointer-events-none top-12 left-10 lg:top-32 lg:left-104">
                  Введите текст или '/' для комманд
                </div>
              }
              ref={onRef}
            />
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
      )}
      {!isSynced && <EditorSkeleton />}
      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      {/* <HistoryPlugin /> */}
      <AutoFocusPlugin />
      <FloatingMenuPlugin />
      <CodeHighlightPlugin />
      <ListPlugin />
      <LinkPlugin />
      {floatingAnchorElem && (
        <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
      )}
      <ComponentPickerMenuPlugin />
      <MarkdownIoPlugin noteId={noteSnapshot.note?._id ?? ""} />
      <LexicalAutoLinkPlugin />
      <ClickableLinkPlugin />
      <CollaborationPlugin
        id={`note-${noteSnapshot.note!._id}`}
        // @ts-ignore
        providerFactory={providerFactory}
        shouldBootstrap={true}
        username={userSnapshot.user.username}
      />
    </LexicalComposer>
  );
}

function EditorSkeleton() {
  return (
    <div className="flex flex-col gap-3 items-center justify-center lg:py-32 lg:px-40">
      <Skeleton className="w-full h-10 rounded-full" />
      <Skeleton className="w-full h-68 rounded-lg" />
      <Skeleton className="w-full h-96 rounded-lg mt-7" />
    </div>
  );
}
