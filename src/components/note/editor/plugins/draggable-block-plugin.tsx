"use client";

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import type { JSX } from "react";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { DraggableBlockPlugin_EXPERIMENTAL } from "@lexical/react/LexicalDraggableBlockPlugin";
import {
  $createParagraphNode,
  $createTextNode,
  $getNearestNodeFromDOMNode,
} from "lexical";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { GripVertical, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "react-responsive";

const DRAGGABLE_BLOCK_MENU_CLASSNAME = "draggable-block-menu";

function isOnMenu(element: HTMLElement): boolean {
  return !!element.closest(`.${DRAGGABLE_BLOCK_MENU_CLASSNAME}`);
}

export default function DraggableBlockPlugin({
  anchorElem = document.body,
}: {
  anchorElem?: HTMLElement;
}): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [draggableElement, setDraggableElement] = useState<HTMLElement | null>(
    null
  );
  const menuRef = useRef<HTMLDivElement>(null);
  const targetLineRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery({
    query: "(min-width: 768px)",
  });

  function insertBlock(e: React.MouseEvent) {
    if (!draggableElement || !editor) {
      return;
    }

    editor.update(() => {
      const node = $getNearestNodeFromDOMNode(draggableElement);
      if (!node) {
        return;
      }

      const pNode = $createParagraphNode();
      const tNode = $createTextNode("/");
      if (e.altKey || e.ctrlKey) {
        node.insertBefore(pNode);
      } else {
        node.insertAfter(pNode);
      }
      pNode.select();
      pNode.append(tNode);
      tNode.select();
    });
  }

  if (!isDesktop) {
    return <></>;
  }

  return (
    <DraggableBlockPlugin_EXPERIMENTAL
      anchorElem={document.body}
      menuRef={menuRef as React.RefObject<HTMLDivElement>}
      targetLineRef={targetLineRef as React.RefObject<HTMLDivElement>}
      menuComponent={
        <div
          className={cn(
            "opacity-0 cursor-grab absolute top-0 left-0 will-change-transform flex z-1000 lg:left-87"
          )}
          ref={menuRef}
        >
          <Button
            className="inline-block cursor-pointer text-muted-foreground hover:bg-transparent dark:hover:bg-transparent w-4"
            variant="ghost"
            onClick={insertBlock}
          >
            <Plus />
          </Button>
          <Button
            className="inline-block cursor-pointer text-muted-foreground hover:bg-transparent dark:hover:bg-transparent w-4"
            variant="ghost"
          >
            <GripVertical />
          </Button>
        </div>
      }
      targetLineComponent={
        <div
          ref={targetLineRef}
          className="absolute bg-pink-400 h-1 left-0 top-0"
        />
      }
      isOnMenu={isOnMenu}
      onElementChanged={setDraggableElement}
    />
  );
}
