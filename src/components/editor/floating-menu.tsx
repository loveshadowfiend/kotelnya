"use client";

import { forwardRef, useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $setBlocksType, $wrapNodes } from "@lexical/selection";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
} from "lexical";
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Strikethrough,
  Underline,
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { $createHeadingNode, $isHeadingNode } from "@lexical/rich-text";
import { Separator } from "../ui/separator";
import { $createCodeNode, $isCodeNode } from "@lexical/code";

export type FloatingMenuCoords = { x: number; y: number } | undefined;

type FloatingMenuState = string[];

type FloatingMenuProps = {
  editor: ReturnType<typeof useLexicalComposerContext>[0];
  coords: FloatingMenuCoords;
};

export const FloatingMenu = forwardRef<HTMLDivElement, FloatingMenuProps>(
  function FloatingMenu(props, ref) {
    const { editor, coords } = props;
    const shouldShow = coords !== undefined;

    const [state, setState] = useState<FloatingMenuState>([]);

    useEffect(() => {
      const unregisterListener = editor.registerUpdateListener(
        ({ editorState }) => {
          editorState.read(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;
            const anchorNode = selection.anchor.getNode();
            const block = anchorNode.getTopLevelElementOrThrow();
            const toggles: FloatingMenuState = [];

            if (selection.hasFormat("bold")) toggles.push("bold");
            if (selection.hasFormat("italic")) toggles.push("italic");
            if (selection.hasFormat("underline")) toggles.push("underline");
            if (selection.hasFormat("strikethrough"))
              toggles.push("strikethrough");
            if ($isHeadingNode(block) && block.getTag() === "h1")
              toggles.push("h1");
            if ($isHeadingNode(block) && block.getTag() === "h2")
              toggles.push("h2");
            if ($isHeadingNode(block) && block.getTag() === "h3")
              toggles.push("h3");
            if ($isCodeNode(block)) toggles.push("code");

            setState(toggles);
          });
        }
      );
      return unregisterListener;
    }, [editor]);

    const formatHeading = (heading: "h1" | "h2" | "h3") => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const anchorNode = selection.anchor.getNode();
          const block = anchorNode.getTopLevelElementOrThrow();
          if ($isHeadingNode(block) && block.getTag() === heading) {
            $setBlocksType(selection, () => $createParagraphNode());
          } else {
            $setBlocksType(selection, () => $createHeadingNode(heading));
          }
        }
      });
    };

    const formatCode = () => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const anchorNode = selection.anchor.getNode();
          const block = anchorNode.getTopLevelElementOrThrow();
          if ($isCodeNode(block)) {
            $setBlocksType(selection, () => $createParagraphNode());
          } else {
            $setBlocksType(selection, () => $createCodeNode());
          }
        }
      });
    };

    return (
      <ToggleGroup
        type="multiple"
        value={state}
        ref={ref}
        className="flex items-center justify-between bg-background border rounded-lg"
        aria-hidden={!shouldShow}
        style={{
          position: "absolute",
          top: coords?.y,
          left: coords?.x,
          visibility: shouldShow ? "visible" : "hidden",
          opacity: shouldShow ? 1 : 0,
        }}
      >
        <ToggleGroupItem
          value="bold"
          aria-label="Toggle bold"
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
          }}
        >
          <Bold />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="italic"
          aria-label="Toggle italic"
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
          }}
        >
          <Italic />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="underline"
          aria-label="Toggle underline"
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
          }}
        >
          <Underline />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="strikethrough"
          aria-label="Toggle strikethrough"
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
          }}
        >
          <Strikethrough />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="h1"
          aria-label="Toggle heading one"
          onClick={() => {
            formatHeading("h1");
          }}
        >
          <Heading1 />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="h2"
          aria-label="Toggle heading two"
          onClick={() => {
            formatHeading("h2");
          }}
        >
          <Heading2 />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="h3"
          aria-label="Toggle heading three"
          onClick={() => {
            formatHeading("h3");
          }}
        >
          <Heading3 />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="code"
          aria-label="Toggle code"
          onClick={() => {
            formatCode();
          }}
        >
          <Code />
        </ToggleGroupItem>
      </ToggleGroup>
    );
  }
);
