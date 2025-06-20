"use client";

import {
  DecoratorNode,
  NodeKey,
  LexicalNode,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import React, { JSX, useCallback } from "react";
import katex from "katex";
import { Textarea } from "@/components/ui/textarea";

export interface MathPayload {
  equation: string;
  inline: boolean;
}

export type SerializedMathNode = Spread<
  {
    equation: string;
    inline: boolean;
  },
  SerializedLexicalNode
>;

export class MathNode extends DecoratorNode<JSX.Element> {
  __equation: string;
  __inline: boolean;

  static getType(): string {
    return "math";
  }

  static clone(node: MathNode): MathNode {
    return new MathNode(node.__equation, node.__inline, node.__key);
  }

  constructor(equation: string, inline: boolean, key?: NodeKey) {
    super(key);
    this.__equation = equation;
    this.__inline = inline;
  }

  createDOM(): HTMLElement {
    const element = document.createElement(this.__inline ? "span" : "div");
    element.className = this.__inline ? "math-inline" : "math-block";
    return element;
  }

  updateDOM(): false {
    return false;
  }

  static importJSON(serializedNode: SerializedMathNode): MathNode {
    const { equation, inline } = serializedNode;
    return $createMathNode(equation, inline);
  }

  exportJSON(): SerializedMathNode {
    return {
      equation: this.__equation,
      inline: this.__inline,
      type: "math",
      version: 1,
    };
  }

  getEquation(): string {
    return this.__equation;
  }

  setEquation(equation: string): void {
    const writable = this.getWritable();
    writable.__equation = equation;
  }

  isInline(): boolean {
    return this.__inline;
  }

  decorate(): JSX.Element {
    return (
      <MathComponent
        equation={this.__equation}
        inline={this.__inline}
        node={this}
      />
    );
  }

  isIsolated(): boolean {
    return true;
  }

  isKeyboardSelectable(): boolean {
    return true;
  }

  canBeEmpty(): boolean {
    return false;
  }

  canInsertTextBefore(): boolean {
    return false;
  }

  canInsertTextAfter(): boolean {
    return false;
  }
}

export function $createMathNode(
  equation: string,
  inline: boolean = false
): MathNode {
  return new MathNode(equation, inline);
}

export function $isMathNode(
  node: LexicalNode | null | undefined
): node is MathNode {
  return node instanceof MathNode;
}

// React component for rendering math
interface MathComponentProps {
  equation: string;
  inline: boolean;
  node: MathNode;
}

function MathComponent({
  equation,
  inline,
  node,
}: MathComponentProps): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const [isEditing, setIsEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState(equation);

  const updateEquation = useCallback(
    (newEquation: string) => {
      // Use queueMicrotask to ensure the update happens after React's render cycle
      queueMicrotask(() => {
        editor.update(() => {
          node.setEquation(newEquation);
        });
      });
    },
    [editor, node]
  );

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditValue(equation);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const newEquation = editValue;
      setIsEditing(false);
      updateEquation(newEquation);
    } else if (e.key === "Escape") {
      setEditValue(equation);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    const newEquation = editValue;
    setIsEditing(false);
    updateEquation(newEquation);
  };

  if (isEditing) {
    return (
      <Textarea
        value={editValue}
        rows={2}
        onChange={(e) => setEditValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className="field-sizing-content"
        autoFocus
      />
    );
  }

  try {
    const html = katex.renderToString(equation, {
      displayMode: !inline,
      throwOnError: false,
    });

    return (
      <span
        className={inline ? "math-inline" : "math-block"}
        dangerouslySetInnerHTML={{ __html: html }}
        onDoubleClick={handleDoubleClick}
        title="Double-click to edit"
      />
    );
  } catch (error) {
    return (
      <span
        className="math-error"
        onDoubleClick={handleDoubleClick}
        title="Double-click to edit"
      >
        Error: {equation}
      </span>
    );
  }
}
