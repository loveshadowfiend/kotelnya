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
import { TRANSFORMERS } from "@lexical/markdown";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { FloatingMenuPlugin } from "./plugins/floating-menu-plugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import CodeHighlightPlugin from "./plugins/code-highlight-plugin";
import DraggableBlockPlugin from "./plugins/draggable-block-plugin";
import { useState } from "react";
import ComponentPickerMenuPlugin from "./plugins/component-picker-plugin";

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

export function Editor() {
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={
          <ContentEditable
            className="focus:outline-none pt-20 px-10 mx-auto max-w-full min-h-screen lg:py-32 lg:px-40 relative"
            aria-placeholder={"Введите текст..."}
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
    </LexicalComposer>
  );
}
