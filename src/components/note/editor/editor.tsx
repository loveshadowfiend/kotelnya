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
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { FloatingMenuPlugin } from "./plugins/floating-menu-plugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import CodeHighlightPlugin from "./plugins/code-highlight-plugin";
import DraggableBlockPlugin from "./plugins/draggable-block-plugin";
import { useEffect, useState } from "react";
import ComponentPickerMenuPlugin from "./plugins/component-picker-plugin";
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
import { SyncedPlugin } from "./plugins/synced-plugin";
import { TRANSFORMERS } from "@lexical/markdown";
import { useRouter } from "next/navigation";
import "katex/dist/katex.min.css";
import { MathNode } from "./nodes/math-node";
import { MathPlugin } from "./plugins/math-plugin";
import { MathTransformPlugin } from "./plugins/math-transform-plugin";
import { MathKeyHandlerPlugin } from "./plugins/math-key-handler-plugin";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMediaQuery } from "react-responsive";

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
      MathNode,
    ],
  };
  const [isLoading, setIsLoading] = useState(true);
  const [isSynced, setIsSynced] = useState(false);
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);
  const router = useRouter();
  const noteSnapshot = useSnapshot(noteStore);
  const userSnapshot = useSnapshot(userStore);
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
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

    provider.on("sync", (synced: boolean) => {
      setIsSynced(synced);
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
      } else {
        router.push("/404");
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
      <RichTextPlugin
        contentEditable={
          <ContentEditable
            className="focus:outline-none pt-20 px-10 mx-auto max-w-full min-h-screen lg:py-32 lg:px-40 relative editor-container"
            aria-placeholder="введите текст или '/' для комманд"
            placeholder={
              isSynced ? (
                <div
                  className="text-muted-foreground absolute pointer-events-none top-20 lg:top-32"
                  style={{
                    left:
                      (floatingAnchorElem?.getBoundingClientRect()?.left ?? 0) +
                      160,
                  }}
                >
                  введите текст или '/' для команд
                </div>
              ) : (
                <div
                  className="flex items-center text-muted-foreground absolute pointer-events-none top-20 lg:top-32"
                  style={{
                    left:
                      (floatingAnchorElem?.getBoundingClientRect()?.left ?? 0) +
                      (isTabletOrMobile ? 40 : 160),
                  }}
                >
                  синхронизация с сервером...
                </div>
              )
            }
            ref={onRef}
          />
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      {/* <MathPlugin />
      <MathTransformPlugin />
      <MathKeyHandlerPlugin /> */}
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
      {/* <MarkdownIoPlugin noteId={noteSnapshot.note?._id ?? ""} /> */}
      <LexicalAutoLinkPlugin />
      <ClickableLinkPlugin />
      <CollaborationPlugin
        id={`note-${noteSnapshot.note!._id}`}
        // @ts-ignore
        providerFactory={providerFactory}
        shouldBootstrap={true}
        username={userSnapshot.user.username}
      />
      <SyncedPlugin isSynced={isSynced} />
    </LexicalComposer>
  );
}

function EditorSkeleton() {
  return (
    <div className="flex flex-col gap-3 items-center justify-center py-20 px-10 lg:py-32 lg:px-40">
      <Skeleton className="w-full h-5 lg:h-10 rounded-full" />
      <Skeleton className="w-full h-34 lg:h-68 rounded-lg" />
      <Skeleton className="w-full h-48 lg:h-96 rounded-lg mt-7" />
    </div>
  );
}
