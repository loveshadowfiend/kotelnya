import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  createCommand,
} from "lexical";

import { MathNode } from "../nodes/math-node";

export const INSERT_MATH_FROM_MARKDOWN_COMMAND = createCommand<string>();

export function MarkdownMathPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const text = editor
          .getEditorState()
          .toJSON()
          .root.children.map((node: any) => node.text)
          .join("");

        if (text.match(/\${1,2}([^$]+)\${1,2}/)) {
          editor.dispatchCommand(INSERT_MATH_FROM_MARKDOWN_COMMAND, text);
        }
      });
    });

    return editor.registerCommand(
      INSERT_MATH_FROM_MARKDOWN_COMMAND,
      (text: string) => {
        editor.update(() => {
          const mathRegex = /\${1,2}([^$]+)\${1,2}/g;
          const selection = $getSelection();

          if (!$isRangeSelection(selection)) return false;

          let match;
          while ((match = mathRegex.exec(text)) !== null) {
            const content = match[1];
            const mathNode = new MathNode(content);
            selection.insertNodes([mathNode]);
          }
        });

        return true;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor]);

  return null;
}
