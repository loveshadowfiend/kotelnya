"use client";

import "./theme.css";
import { forwardRef, useEffect, useRef, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $setBlocksType } from "@lexical/selection";
import {
  $createParagraphNode,
  $getSelection,
  $isParagraphNode,
  $isRangeSelection,
  FORMAT_ELEMENT_COMMAND,
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
  TextQuote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ListOrdered,
  List,
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
  $isQuoteNode,
} from "@lexical/rich-text";
import { $createCodeNode, $isCodeNode } from "@lexical/code";
import { $createListNode, $isListNode } from "@lexical/list";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export type FloatingMenuCoords = { x: number; y: number } | undefined;

type FloatingMenuProps = {
  editor: ReturnType<typeof useLexicalComposerContext>[0];
  coords: FloatingMenuCoords;
};

export const FloatingMenu = forwardRef<HTMLDivElement, FloatingMenuProps>(
  function FloatingMenu(props, ref) {
    const { editor, coords } = props;
    const isTabletOrMobile = useIsMobile();
    const shouldShow = coords !== undefined;
    const [state, setState] = useState<string[]>([]);
    const [special, setSpecial] = useState<string>("");
    const [alignment, setAlignment] = useState<string>("");

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

    const formatUnorderedList = () => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createListNode("bullet"));
        }
      });
    };

    const formatOrderedList = () => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createListNode("number"));
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
            const blockFormat = block.getFormatType();
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
            if ($isQuoteNode(block)) setSpecial("quote");
            if ($isListNode(block)) {
              console.log("list", block.getListType());
              if (block.getListType() === "bullet") setSpecial("ul");
              if (block.getListType() === "number") setSpecial("ol");
            }

            setAlignment(blockFormat);
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
        className={cn(
          `absolute items-center justify-between bg-background border rounded-lg z-10000`,
          {
            visible: shouldShow,
            invisible: !shouldShow,
          }
        )}
        aria-hidden={!shouldShow}
        style={{
          top: coords?.y === undefined ? 0 : coords?.y,
          left:
            coords?.x === undefined
              ? 0
              : isTabletOrMobile
              ? //@ts-ignore-next-line
                window.innerWidth / 2 - ref.current.offsetWidth / 2
              : coords?.x,
        }}
      >
        <Select
          value={alignment === "" ? "left" : alignment}
          onValueChange={(value) => {
            switch (value) {
              case "left":
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
                break;
              case "center":
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
                break;
              case "right":
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
                break;
              case "justify":
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
                break;
              default:
                break;
            }
          }}
        >
          <SelectTrigger className="w-fit border-0 bg-background rounded-none rounded-l-lg focus:outline-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="text-muted-foreground">
            <SelectItem value="left">
              <AlignLeft className="w-4 h-4" />
              <span>Слева</span>
            </SelectItem>
            <SelectItem value="center">
              <AlignCenter />
              <span>Центр</span>
            </SelectItem>
            <SelectItem value="right">
              <AlignRight />
              <span>Справа</span>
            </SelectItem>
            <SelectItem value="justify">
              <AlignJustify />
              <span>По ширине</span>
            </SelectItem>
          </SelectContent>
        </Select>
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
            switch (value) {
              case "paragraph":
                formatParagraph();
                break;
              case "h1":
              case "h2":
              case "h3":
                formatHeading(value);
                break;
              case "code":
                formatCode();
                break;
              case "quote":
                formatQuote();
                break;
              case "ul":
                formatUnorderedList();
                break;
              case "ol":
                formatOrderedList();
                break;
              default:
                break;
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
            <SelectItem value="ol">
              <ListOrdered />
              <span>Нумерованный список</span>
            </SelectItem>
            <SelectItem value="ul">
              <List />
              <span>Маркированный список</span>
            </SelectItem>
            <SelectItem value="code">
              <Code />
              <span>Код</span>
            </SelectItem>
            <SelectItem value="quote">
              <TextQuote />
              <span>Цитата</span>
            </SelectItem>
          </SelectContent>
        </Select>
      </ToggleGroup>
    );
  }
);
