"use client";

import "./theme.css";
import { forwardRef, useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $setBlocksType, $wrapNodes } from "@lexical/selection";
import {
  $createParagraphNode,
  $getSelection,
  $isParagraphNode,
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
  Type,
  Underline,
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
} from "@lexical/rich-text";
import { $createCodeNode, $isCodeNode } from "@lexical/code";

export type FloatingMenuCoords = { x: number; y: number } | undefined;

type FloatingMenuProps = {
  editor: ReturnType<typeof useLexicalComposerContext>[0];
  coords: FloatingMenuCoords;
};

export const FloatingMenu = forwardRef<HTMLDivElement, FloatingMenuProps>(
  function FloatingMenu(props, ref) {
    const { editor, coords } = props;
    const shouldShow = coords !== undefined;

    const [state, setState] = useState<string[]>([]);
    const [special, setSpecial] = useState<string>("");

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

    const formatQuote = () => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const anchorNode = selection.anchor.getNode();
          const block = anchorNode.getTopLevelElementOrThrow();
          if ($isCodeNode(block)) {
            $setBlocksType(selection, () => $createParagraphNode());
          } else {
            $setBlocksType(selection, () => $createQuoteNode());
          }
        }
      });
    };

    const formatParagraph = () => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createParagraphNode());
        }
      });
    };

    useEffect(() => {
      const unregisterListener = editor.registerUpdateListener(
        ({ editorState }) => {
          editorState.read(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;
            const anchorNode = selection.anchor.getNode();
            const block = anchorNode.getTopLevelElementOrThrow();
            const toggles: string[] = [];

            if (selection.hasFormat("bold")) toggles.push("bold");
            if (selection.hasFormat("italic")) toggles.push("italic");
            if (selection.hasFormat("underline")) toggles.push("underline");
            if (selection.hasFormat("strikethrough"))
              toggles.push("strikethrough");

            if ($isParagraphNode(block)) setSpecial("paragraph");
            if ($isHeadingNode(block) && block.getTag() === "h1")
              setSpecial("h1");
            if ($isHeadingNode(block) && block.getTag() === "h2")
              setSpecial("h2");
            if ($isHeadingNode(block) && block.getTag() === "h3")
              setSpecial("h3");
            if ($isCodeNode(block)) setSpecial("code");

            setState(toggles);
          });
        }
      );
      return unregisterListener;
    }, [editor]);

    return (
      <ToggleGroup
        type="multiple"
        value={state}
        ref={ref}
        className="flex items-center justify-between bg-background border rounded-lg z-50"
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
        <Select
          value={special}
          onValueChange={(value) => {
            if (value === "paragraph") {
              formatParagraph();
            } else if (value === "h1" || value === "h2" || value === "h3") {
              formatHeading(value);
            } else if (value === "code") {
              formatCode();
            }
          }}
        >
          <SelectTrigger className="w-fit border-0 bg-background rounded-none rounded-r-lg focus:outline-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="text-muted-foreground">
            <SelectItem value="paragraph">
              <Type />
              <span>Текст</span>
            </SelectItem>
            <SelectItem value="h1">
              <Heading1 />
              <span>Заголовок 1</span>
            </SelectItem>
            <SelectItem value="h2">
              <Heading2 />
              <span>Заголовок 2</span>
            </SelectItem>
            <SelectItem value="h3">
              <Heading3 />
              <span>Заголовок 3</span>
            </SelectItem>
            <SelectItem value="code">
              <Code />
              <span>Код</span>
            </SelectItem>
          </SelectContent>
        </Select>
      </ToggleGroup>
    );
  }
);
