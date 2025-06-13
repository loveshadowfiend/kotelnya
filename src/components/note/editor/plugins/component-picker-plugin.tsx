"use client";

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useMemo, useState, useRef, type JSX } from "react";
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch,
} from "@lexical/react/LexicalTypeaheadMenuPlugin";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $insertNodes,
  LexicalEditor,
  TextNode,
} from "lexical";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  TextQuote,
  Type,
  Image,
  Table,
} from "lucide-react";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createCodeNode } from "@lexical/code";
import { cn } from "@/lib/utils";
import { InsertTableDialog } from "./table-plugin";

// Image node creation function
function $createImageNode(
  src: string,
  altText: string = "",
  maxWidth?: number
): any {
  // This is a simplified image node creation
  // You might need to import from @lexical/image or create a custom image node
  const img = document.createElement("img");
  img.src = src;
  img.alt = altText;
  if (maxWidth) {
    img.style.maxWidth = `${maxWidth}px`;
  }
  img.style.height = "auto";

  // For now, we'll insert as HTML
  // In a real implementation, you'd want to create a proper Lexical ImageNode
  return img;
}

class ComponentPickerOption extends MenuOption {
  // What shows up in the editor
  title: string;
  description?: string;
  // Icon for display
  icon?: JSX.Element;
  // For extra searching.
  keywords: Array<string>;
  // TBD
  keyboardShortcut?: string;
  // What happens when you select this option?
  onSelect: (queryString: string) => void;

  constructor(
    title: string,
    options: {
      icon?: JSX.Element;
      keywords?: Array<string>;
      keyboardShortcut?: string;
      onSelect: (queryString: string) => void;
    }
  ) {
    super(title);
    this.title = title;
    this.keywords = options.keywords || [];
    this.icon = options.icon;
    this.keyboardShortcut = options.keyboardShortcut;
    this.onSelect = options.onSelect.bind(this);
  }
}

function ComponentPickerMenuItem({
  index,
  isSelected,
  onClick,
  onMouseEnter,
  option,
}: {
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: ComponentPickerOption;
}) {
  const className = "flex items-center w-60 px-1 py-1 rounded-md";

  return (
    <li
      key={option.key}
      tabIndex={-1}
      className={cn(className, { "text-foreground bg-muted": isSelected })}
      ref={option.setRefElement}
      role="option"
      aria-selected={isSelected}
      id={"typeahead-item-" + index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      {option.icon}
      <span className="text">{option.title}</span>
    </li>
  );
}

function getDynamicOptions(editor: LexicalEditor, queryString: string) {
  const options: Array<ComponentPickerOption> = [];

  if (queryString == null) {
    return options;
  }

  return options;
}

// Helper function to handle file upload
function handleImageUpload(editor: LexicalEditor, file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Selected file is not an image"));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;

      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          // Create a paragraph with the image
          const paragraph = $createParagraphNode();

          // Create image element (in a real implementation, you'd use a proper ImageNode)
          const imgElement = document.createElement("img");
          imgElement.src = src;
          imgElement.alt = file.name;
          imgElement.style.maxWidth = "100%";
          imgElement.style.height = "auto";
          imgElement.style.display = "block";
          imgElement.style.margin = "1rem 0";

          // Insert the image
          // Note: This is a simplified approach. In production, you'd want to:
          // 1. Upload the image to a server/CDN
          // 2. Use a proper Lexical ImageNode
          // 3. Handle loading states and errors

          const htmlString = imgElement.outerHTML;
          selection.insertRawText(htmlString);
        }
      });

      resolve();
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsDataURL(file);
  });
}

function getBaseOptions(
  editor: LexicalEditor,
  setIsTableDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
) {
  const divClassName = "px-2 py-1 rounded-sm";
  const iconClassName = "w-4 h-4";

  return [
    new ComponentPickerOption("Текст", {
      icon: (
        <div className={divClassName}>
          <Type className={iconClassName} />
        </div>
      ),
      keywords: ["параграф", "p", "текст"],
      onSelect: () =>
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createParagraphNode());
          }
        }),
    }),
    ...([1, 2, 3] as const).map(
      (n) =>
        new ComponentPickerOption(`Заголовок ${n}`, {
          icon: (
            <div className={divClassName}>
              {n === 1 && <Heading1 className={iconClassName} />}
              {n === 2 && <Heading2 className={iconClassName} />}
              {n === 3 && <Heading3 className={iconClassName} />}
            </div>
          ),
          keywords: ["загловок", `h${n}`],
          onSelect: () =>
            editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createHeadingNode(`h${n}`));
              }
            }),
        })
    ),
    new ComponentPickerOption("Нумерованный список", {
      icon: (
        <div className={divClassName}>
          <ListOrdered className={iconClassName} />
        </div>
      ),
      keywords: ["нумерованный список", "ol"],
      onSelect: () =>
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined),
    }),
    new ComponentPickerOption("Маркированный список", {
      icon: (
        <div className={divClassName}>
          <List className={iconClassName} />
        </div>
      ),
      keywords: ["маркированный список", "ul"],
      onSelect: () =>
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined),
    }),
    new ComponentPickerOption("Цитата", {
      icon: (
        <div className={divClassName}>
          <TextQuote className={iconClassName} />
        </div>
      ),
      keywords: ["цитата"],
      onSelect: () =>
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createQuoteNode());
          }
        }),
    }),
    new ComponentPickerOption("Код", {
      icon: (
        <div className={divClassName}>
          <Code className={iconClassName} />
        </div>
      ),
      keywords: ["код", "code"],
      onSelect: () =>
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createCodeNode());
          }
        }),
    }),
    new ComponentPickerOption("Таблица", {
      icon: (
        <div className={divClassName}>
          <Table className={iconClassName} />
        </div>
      ),
      keywords: ["таблица", "table"],
      onSelect: () => setIsTableDialogOpen(true),
    }),
    new ComponentPickerOption("Изображение", {
      icon: (
        <div className={divClassName}>
          <Image className={iconClassName} />
        </div>
      ),
      keywords: ["изображение", "картинка", "фото", "img"],
      onSelect: () => {
        // Create and trigger file input
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";
        fileInput.style.display = "none";

        fileInput.onchange = async (event) => {
          const target = event.target as HTMLInputElement;
          const file = target.files?.[0];

          if (file) {
            try {
              await handleImageUpload(editor, file);
            } catch (error) {
              console.error("Error uploading image:", error);
              // You might want to show a toast notification here
            }
          }

          // Clean up
          document.body.removeChild(fileInput);
        };

        document.body.appendChild(fileInput);
        fileInput.click();
      },
    }),
  ];
}

export default function ComponentPickerMenuPlugin(): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [isTableDialogOpen, setIsTableDialogOpen] = useState<boolean>(false);
  const [queryString, setQueryString] = useState<string | null>(null);

  const checkForTriggerMatch = useBasicTypeaheadTriggerMatch("/", {
    minLength: 0,
  });

  const options = useMemo(() => {
    const baseOptions = getBaseOptions(editor, setIsTableDialogOpen);

    if (!queryString) {
      return baseOptions;
    }

    const regex = new RegExp(queryString, "i");

    return [
      ...getDynamicOptions(editor, queryString),
      ...baseOptions.filter(
        (option) =>
          regex.test(option.title) ||
          option.keywords.some((keyword) => regex.test(keyword))
      ),
    ];
  }, [editor, queryString]);

  const onSelectOption = useCallback(
    (
      selectedOption: ComponentPickerOption,
      nodeToRemove: TextNode | null,
      closeMenu: () => void,
      matchingString: string
    ) => {
      editor.update(() => {
        nodeToRemove?.remove();
        selectedOption.onSelect(matchingString);
        closeMenu();
      });
    },
    [editor]
  );

  return (
    <>
      <LexicalTypeaheadMenuPlugin<ComponentPickerOption>
        onQueryChange={setQueryString}
        onSelectOption={onSelectOption}
        triggerFn={checkForTriggerMatch}
        options={options}
        menuRenderFn={(
          anchorElementRef,
          { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }
        ) =>
          anchorElementRef.current && options.length
            ? ReactDOM.createPortal(
                <div className="absolute text-sm z-1000 text-muted-foreground rounded-lg border p-1 bg-background">
                  <ul>
                    {options.map((option, i: number) => (
                      <ComponentPickerMenuItem
                        index={i}
                        isSelected={selectedIndex === i}
                        onClick={() => {
                          setHighlightedIndex(i);
                          selectOptionAndCleanUp(option);
                        }}
                        onMouseEnter={() => {
                          setHighlightedIndex(i);
                        }}
                        key={option.key}
                        option={option}
                      />
                    ))}
                  </ul>
                </div>,
                anchorElementRef.current
              )
            : null
        }
      />
      <InsertTableDialog
        activeEditor={editor}
        open={isTableDialogOpen}
        setOpen={setIsTableDialogOpen}
      />
    </>
  );
}
