"use client";

import { theme } from "./theme";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { LinkNode } from "@lexical/link";
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
import CodeHighlightPlugin from "./plugins/code-highlight-plugin";

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
  ],
};

function onError(error: any) {
  console.error(error);
}

export function Editor() {
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={
          <ContentEditable
            className="focus:outline-none w-[60%] mx-auto my-16"
            aria-placeholder={"Введите текст..."}
            placeholder={<div></div>}
          />
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      <HistoryPlugin />
      <AutoFocusPlugin />
      <FloatingMenuPlugin />
      <CodeHighlightPlugin />
    </LexicalComposer>
  );
}
