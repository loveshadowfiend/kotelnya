"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { computePosition } from "@floating-ui/dom";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection } from "lexical";
import {
  FloatingMenu,
  FloatingMenuCoords,
} from "@/components/note/editor/floating-menu";
import { usePointerInteractions } from "@/hooks/use-pointer-interactions";

export function FloatingMenuPlugin() {
  const ref = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<FloatingMenuCoords>(undefined);
  const [editor] = useLexicalComposerContext();
  const { isPointerDown, isPointerReleased } = usePointerInteractions();
  const [isClient, setIsClient] = useState(false);
  const isEditable = editor.isEditable();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const calculatePosition = useCallback(() => {
    const domSelection = getSelection();
    const domRange =
      domSelection?.rangeCount !== 0 && domSelection?.getRangeAt(0);

    if (!domRange || !ref.current || isPointerDown) return setCoords(undefined);

    computePosition(domRange, ref.current, { placement: "top" })
      .then((pos) => {
        setCoords({ x: pos.x, y: pos.y - 10 });
      })
      .catch(() => {
        setCoords(undefined);
      });
  }, [isPointerDown]);

  const $handleSelectionChange = useCallback(() => {
    if (
      editor.isComposing() ||
      editor.getRootElement() !== document.activeElement
    ) {
      setCoords(undefined);
      return;
    }

    const selection = $getSelection();

    if ($isRangeSelection(selection) && !selection.anchor.is(selection.focus)) {
      calculatePosition();
    } else {
      setCoords(undefined);
    }
  }, [editor, calculatePosition]);

  useEffect(() => {
    const unregisterListener = editor.registerUpdateListener(
      ({ editorState }) => {
        editorState.read(() => $handleSelectionChange());
      }
    );
    return unregisterListener;
  }, [editor, $handleSelectionChange]);

  const show = coords !== undefined;

  useEffect(() => {
    if (!show && isPointerReleased) {
      editor.getEditorState().read(() => $handleSelectionChange());
    }
  }, [isPointerReleased, $handleSelectionChange, editor]);

  if (!isClient || !isEditable) return null;

  return createPortal(
    <FloatingMenu ref={ref} editor={editor} coords={coords} />,
    document.body
  );
}
