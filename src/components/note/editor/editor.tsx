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
import { useEffect, useState } from "react";
import ComponentPickerMenuPlugin from "./plugins/component-picker-plugin";
import MarkdownIoPlugin from "./plugins/markdown-io-plugin";
import { useSnapshot } from "valtio";
import { noteStore } from "@/stores/note-store";
import { getNote } from "@/api/notes/routes";
import LexicalAutoLinkPlugin from "./plugins/auto-link-plugin";
import { ClickableLinkPlugin } from "@lexical/react/LexicalClickableLinkPlugin";
import { $setSelection } from "lexical";

const initialConfig = {
  namespace: "kotelnya-editor",
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

function onError(error: any) {
  console.error(error);
}

interface EditorProps {
  noteId: string;
}

export function Editor({ noteId }: EditorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const noteSnapshot = useSnapshot(noteStore);
  const isNoteEmpty =
    Object.keys(noteSnapshot).length === 0 &&
    noteSnapshot.constructor === Object;
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);
  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
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
    isLoading
  ) {
    return;
  }

  return (
    <LexicalComposer
      initialConfig={{
        ...initialConfig,
        editorState: () => {
          $convertFromMarkdownString(
            noteSnapshot.note?.markdownContent ?? "",
            TRANSFORMERS
          );
          $setSelection(null);
        },
      }}
    >
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
      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      <HistoryPlugin />
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
    </LexicalComposer>
  );
}
