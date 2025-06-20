"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $insertNodes,
  $getSelection,
  $isRangeSelection,
  createCommand,
  LexicalCommand,
} from "lexical";
import { useEffect } from "react";
import { MathNode, $createMathNode } from "../nodes/math-node";

export function MathPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([MathNode])) {
      throw new Error("MathPlugin: MathNode not registered on editor");
    }

    const removeTextMatchTransform = editor.registerTextContentListener(
      (text) => {
        // Match $$ delimited math expressions
        const mathRegex = /\$\$(.*?)\$\$/g;
        const inlineMathRegex = /\$(.*?)\$/g;

        queueMicrotask(() => {
          editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;

            const textContent = selection.getTextContent();

            // Check for block math ($$...$$)
            let match = mathRegex.exec(textContent);
            if (match) {
              const equation = match[1].trim();
              if (equation) {
                const mathNode = $createMathNode(equation, false);
                $insertNodes([mathNode]);
                return;
              }
            }

            // Check for inline math ($...$)
            match = inlineMathRegex.exec(textContent);
            if (match) {
              const equation = match[1].trim();
              if (equation) {
                const mathNode = $createMathNode(equation, true);
                $insertNodes([mathNode]);
                return;
              }
            }
          });
        });
      }
    );

    return removeTextMatchTransform;
  }, [editor]);

  return null;
}

// Alternative approach using command system
export const INSERT_MATH_COMMAND: LexicalCommand<{
  equation: string;
  inline: boolean;
}> = createCommand("INSERT_MATH_COMMAND");

export function MathPluginWithCommands(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([MathNode])) {
      throw new Error("MathPlugin: MathNode not registered on editor");
    }

    const removeCommand = editor.registerCommand(
      INSERT_MATH_COMMAND,
      (payload: { equation: string; inline: boolean }) => {
        const { equation, inline } = payload;
        const mathNode = $createMathNode(equation, inline);
        $insertNodes([mathNode]);
        return true;
      },
      1 // Priority
    );

    return removeCommand;
  }, [editor]);

  return null;
}
