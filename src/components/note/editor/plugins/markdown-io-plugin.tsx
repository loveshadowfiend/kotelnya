"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useRef } from "react";
import { $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import { useSnapshot } from "valtio";
import { noteStore } from "@/stores/note-store";
import { updateNote } from "@/api/notes/routes";

interface MarkdownIoPluginProps {
  noteId: string;
}

export default function MarkdownIoPlugin({ noteId }: MarkdownIoPluginProps) {
  const noteSnapshot = useSnapshot(noteStore);
  const [editor] = useLexicalComposerContext();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const unregisterListener = editor.registerUpdateListener(
      ({ editorState }) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        if (noteSnapshot.note && noteSnapshot.note._id !== noteId) {
          return;
        }

        timeoutRef.current = setTimeout(() => {
          editorState.read(() => {
            const markdownContent = $convertToMarkdownString(TRANSFORMERS);

            if (noteStore.note && noteSnapshot.note) {
              noteStore.note.markdownContent = markdownContent;
              updateNote(noteSnapshot.note._id, markdownContent);
            }
          });
        }, 1000);
      }
    );

    return unregisterListener;
  }, [editor]);

  return null;
}
