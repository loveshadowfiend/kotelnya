"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useRef } from "react";
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
} from "@lexical/markdown";
import { useSnapshot } from "valtio";
import { noteStore } from "@/stores/note-store";
import { updateNote } from "@/api/auth/notes/routes";

export default function MarkdownIoPlugin() {
  const noteSnapshot = useSnapshot(noteStore);
  const [editor] = useLexicalComposerContext();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const unregisterListener = editor.registerUpdateListener(
      ({ editorState }) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          editorState.read(() => {
            const markdownContent = $convertToMarkdownString(TRANSFORMERS);

            updateNote(noteSnapshot._id, markdownContent);
          });
        }, 1000);
      }
    );

    return unregisterListener;
  }, [editor]);

  return null;
}
