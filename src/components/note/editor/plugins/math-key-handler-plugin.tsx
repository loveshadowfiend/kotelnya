"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  $isNodeSelection,
  $createParagraphNode,
  $createTextNode,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  COMMAND_PRIORITY_LOW,
} from "lexical";
import { useEffect } from "react";
import { MathNode, $isMathNode } from "../nodes/math-node";

export function MathKeyHandlerPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const removeBackspaceCommand = editor.registerCommand(
      KEY_BACKSPACE_COMMAND,
      (event: KeyboardEvent) => {
        const selection = $getSelection();

        // Handle node selection (when math node is selected)
        if ($isNodeSelection(selection)) {
          const nodes = selection.getNodes();
          const mathNodes = nodes.filter($isMathNode);

          if (mathNodes.length > 0) {
            event.preventDefault();
            mathNodes.forEach((node) => node.remove());

            // Create a new paragraph with cursor after deletion
            const paragraph = $createParagraphNode();
            const textNode = $createTextNode("");
            paragraph.append(textNode);

            // Insert the paragraph where the math node was
            if (nodes[0]) {
              nodes[0].getParent()?.insertAfter(paragraph);
              textNode.select();
            }

            return true;
          }
        }

        // Handle range selection (when cursor is next to math node)
        if ($isRangeSelection(selection)) {
          const anchor = selection.anchor;
          const focus = selection.focus;

          // Check if we're at the start of a text node that follows a math node
          if (anchor.offset === 0 && focus.offset === 0) {
            const anchorNode = anchor.getNode();
            const previousSibling = anchorNode.getPreviousSibling();

            if ($isMathNode(previousSibling)) {
              event.preventDefault();
              previousSibling.remove();
              return true;
            }
          }

          // Check if selection is collapsed and we're deleting backwards into a math node
          if (selection.isCollapsed()) {
            const anchorNode = anchor.getNode();

            // If we're at the beginning of a text node
            if (anchor.offset === 0) {
              const previousSibling = anchorNode.getPreviousSibling();

              // If previous sibling is a math node, delete it
              if ($isMathNode(previousSibling)) {
                event.preventDefault();
                previousSibling.remove();
                return true;
              }
            }
          }
        }

        return false;
      },
      COMMAND_PRIORITY_LOW
    );

    const removeDeleteCommand = editor.registerCommand(
      KEY_DELETE_COMMAND,
      (event: KeyboardEvent) => {
        const selection = $getSelection();

        // Handle node selection
        if ($isNodeSelection(selection)) {
          const nodes = selection.getNodes();
          const mathNodes = nodes.filter($isMathNode);

          if (mathNodes.length > 0) {
            event.preventDefault();
            mathNodes.forEach((node) => node.remove());
            return true;
          }
        }

        // Handle range selection
        if ($isRangeSelection(selection)) {
          const anchor = selection.anchor;

          if (selection.isCollapsed()) {
            const anchorNode = anchor.getNode();

            // If we're at the end of a text node
            if (anchor.offset === anchorNode.getTextContent().length) {
              const nextSibling = anchorNode.getNextSibling();

              // If next sibling is a math node, delete it
              if ($isMathNode(nextSibling)) {
                event.preventDefault();
                nextSibling.remove();
                return true;
              }
            }
          }
        }

        return false;
      },
      COMMAND_PRIORITY_LOW
    );

    return () => {
      removeBackspaceCommand();
      removeDeleteCommand();
    };
  }, [editor]);

  return null;
}

// Enhanced version with better cursor positioning
export function AdvancedMathKeyHandlerPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const handleMathNodeDeletion = (
      event: KeyboardEvent,
      isBackspace: boolean
    ): boolean => {
      const selection = $getSelection();

      if ($isNodeSelection(selection)) {
        const nodes = selection.getNodes();
        const mathNodes = nodes.filter($isMathNode);

        if (mathNodes.length > 0) {
          event.preventDefault();

          // Get the parent and position for cursor placement
          const firstMathNode = mathNodes[0];
          const parent = firstMathNode.getParent();
          const nodeIndex = firstMathNode.getIndexWithinParent();

          // Remove all selected math nodes
          mathNodes.forEach((node) => node.remove());

          // Position cursor after deletion
          if (parent) {
            const siblings = parent.getChildren();

            if (siblings.length === 0) {
              // If parent is empty, create a text node
              const textNode = $createTextNode("");
              parent.append(textNode);
              textNode.select();
            } else if (nodeIndex < siblings.length) {
              // Position cursor at the next node
              const nextNode = siblings[nodeIndex];
              if (nextNode.getTextContent()) {
                nextNode.selectStart();
              }
            } else if (nodeIndex > 0) {
              // Position cursor at the end of previous node
              const prevNode = siblings[nodeIndex - 1];
              if (prevNode.getTextContent()) {
                prevNode.selectEnd();
              }
            }
          }

          return true;
        }
      }

      if ($isRangeSelection(selection) && selection.isCollapsed()) {
        const anchor = selection.anchor;
        const anchorNode = anchor.getNode();

        if (isBackspace) {
          // Backspace: check previous sibling when at start of node
          if (anchor.offset === 0) {
            const previousSibling = anchorNode.getPreviousSibling();
            if ($isMathNode(previousSibling)) {
              event.preventDefault();
              previousSibling.remove();
              return true;
            }
          }
        } else {
          // Delete: check next sibling when at end of node
          const textContent = anchorNode.getTextContent();
          if (anchor.offset === textContent.length) {
            const nextSibling = anchorNode.getNextSibling();
            if ($isMathNode(nextSibling)) {
              event.preventDefault();
              nextSibling.remove();
              return true;
            }
          }
        }
      }

      return false;
    };

    const removeBackspaceCommand = editor.registerCommand(
      KEY_BACKSPACE_COMMAND,
      (event: KeyboardEvent) => handleMathNodeDeletion(event, true),
      COMMAND_PRIORITY_LOW
    );

    const removeDeleteCommand = editor.registerCommand(
      KEY_DELETE_COMMAND,
      (event: KeyboardEvent) => handleMathNodeDeletion(event, false),
      COMMAND_PRIORITY_LOW
    );

    return () => {
      removeBackspaceCommand();
      removeDeleteCommand();
    };
  }, [editor]);

  return null;
}
