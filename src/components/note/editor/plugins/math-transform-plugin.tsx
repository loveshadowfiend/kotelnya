"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  TextNode,
} from "lexical";
import { $createMathNode } from "../nodes/math-node";
import { useEffect } from "react";

export function MathTransformPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const removeTransform = editor.registerNodeTransform(
      TextNode,
      (textNode: TextNode) => {
        // Defer the transform to avoid flushSync issues
        queueMicrotask(() => {
          editor.update(() => {
            const text = textNode.getTextContent();

            // Block math pattern: $...$
            const blockMathRegex = /\$\$(.*?)\$\$/;
            const blockMatch = text.match(blockMathRegex);

            if (blockMatch) {
              const equation = blockMatch[1].trim();
              if (equation) {
                const mathNode = $createMathNode(equation, false);
                textNode.replace(mathNode);
                return;
              }
            }

            // Inline math pattern: $...$ (but not $)
            const inlineMathRegex = /(?<!\$)\$([^$]+)\$(?!\$)/;
            const inlineMatch = text.match(inlineMathRegex);

            if (inlineMatch) {
              const equation = inlineMatch[1].trim();
              if (equation) {
                const beforeText = text.substring(0, inlineMatch.index);
                const afterText = text.substring(
                  inlineMatch.index! + inlineMatch[0].length
                );

                const nodes = [];
                if (beforeText) {
                  nodes.push($createTextNode(beforeText));
                }
                nodes.push($createMathNode(equation, true));
                if (afterText) {
                  nodes.push($createTextNode(afterText));
                }

                // Replace with individual nodes
                const firstNode = nodes[0];
                textNode.replace(firstNode);

                // Insert remaining nodes after the first one
                let currentNode = firstNode;
                for (let i = 1; i < nodes.length; i++) {
                  currentNode.insertAfter(nodes[i]);
                  currentNode = nodes[i];
                }
                return;
              }
            }
          });
        });
      }
    );

    return removeTransform;
  }, [editor]);

  return null;
}

// More sophisticated transform that handles multiple math expressions
export function AdvancedMathTransformPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const removeTransform = editor.registerNodeTransform(
      TextNode,
      (textNode: TextNode) => {
        // Defer the transform to avoid flushSync issues
        setTimeout(() => {
          editor.update(() => {
            const text = textNode.getTextContent();

            // Combined regex to find both inline and block math
            const mathRegex = /(\$\$([^$]+)\$\$)|(?<!\$)\$([^$]+)\$(?!\$)/g;
            const matches = Array.from(text.matchAll(mathRegex));

            if (matches.length === 0) return;

            const nodes = [];
            let lastIndex = 0;

            matches.forEach((match) => {
              const matchStart = match.index!;
              const matchEnd = matchStart + match[0].length;

              // Add text before the match
              if (matchStart > lastIndex) {
                const beforeText = text.substring(lastIndex, matchStart);
                nodes.push($createTextNode(beforeText));
              }

              // Determine if it's block or inline math
              const isBlock = match[0].startsWith("$");
              const equation = (isBlock ? match[2] : match[3]).trim();

              if (equation) {
                nodes.push($createMathNode(equation, !isBlock));
              }

              lastIndex = matchEnd;
            });

            // Add remaining text
            if (lastIndex < text.length) {
              const remainingText = text.substring(lastIndex);
              nodes.push($createTextNode(remainingText));
            }

            // Replace the original text node with the new nodes
            if (nodes.length > 0) {
              // Replace the text node with the first node
              const firstNode = nodes[0];
              textNode.replace(firstNode);

              // Insert remaining nodes after the first one
              let currentNode = firstNode;
              for (let i = 1; i < nodes.length; i++) {
                currentNode.insertAfter(nodes[i]);
                currentNode = nodes[i];
              }
            }
          });
        }, 0);
      }
    );

    return removeTransform;
  }, [editor]);

  return null;
}
