"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { getAllColumnTitlesAndIds, boardStore } from "@/stores/board-store";
import { useSnapshot } from "valtio";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { BadgeDropdown } from "./badge-dropdown";
import { DatePicker } from "./date-picker";
import { updateTask } from "@/api/tasks/route";
import { KanbanRenameTaskDropdown } from "./rename-task-dropdown";
import { useIsMobile } from "@/hooks/use-mobile";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { Components } from "react-markdown";
import { cn } from "@/lib/utils";

interface KanbanCardProps {
  taskId: string;
  columnId: string;
  isDialogOpen: boolean;
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
}

export function KanbanCard({
  taskId,
  columnId,
  isDialogOpen,
  setIsDialogOpen,
}: KanbanCardProps) {
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const boardSnapshot = useSnapshot(boardStore);
  const isTabletOrMobile = useIsMobile();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const components: Components = {
    ol: ({ children, ...props }) => (
      <ol className="list-decimal list-inside" {...props}>
        {children}
      </ol>
    ),
    ul: ({ children, ...props }) => (
      <ul className="ml-1 list-disc list-inside" {...props}>
        {children}
      </ul>
    ),
    code(props) {
      const { children, className } = props;
      const match = /language-(\w+)/.exec(className || "");

      return match ? (
        <SyntaxHighlighter
          style={tomorrow as any}
          language={match[1]}
          PreTag="div"
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={cn("w-full", className)}>{children}</code>
      );
    },
  };

  return (
    <Drawer
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      direction={isTabletOrMobile ? "bottom" : "right"}
    >
      <DrawerContent>
        <DrawerHeader>
          <KanbanRenameTaskDropdown
            taskId={taskId}
            taskTitle={boardSnapshot.tasks[taskId].title}
          >
            <DialogTitle className="w-full text-left flex items-center gap-3 field-sizing-content hover:cursor-pointer">
              {boardSnapshot.tasks[taskId].title}{" "}
            </DialogTitle>
            <BadgeDropdown
              className="my-3"
              currentColumndId={columnId}
              taskId={taskId}
              title={boardSnapshot.columns[columnId].title}
              items={getAllColumnTitlesAndIds()}
            />
          </KanbanRenameTaskDropdown>
        </DrawerHeader>
        <div className="grid gap-6 mx-4 mb-4">
          <div className="grid gap-3">
            <Label htmlFor="deadline">дедлайн</Label>
            <DatePicker className="w-full" taskId={taskId} />
          </div>
          <div className="grid gap-3">
            <Label className="group flex justify-between" htmlFor="description">
              <span>описание</span>
              {!isEditingDescription && (
                <span
                  className="text-muted-foreground font-normal hover:underline hover:text-foreground hover:cursor-pointer z-1000"
                  onClick={() => setIsEditingDescription(true)}
                >
                  редактировать
                </span>
              )}
              {isEditingDescription && (
                <span
                  className="text-muted-foreground font-normal hover:underline hover:text-foreground hover:cursor-pointer"
                  onClick={() => setIsEditingDescription(false)}
                >
                  сохранить
                </span>
              )}
            </Label>
            {boardSnapshot.tasks[taskId].description &&
              !isEditingDescription && (
                <div className="text-sm">
                  <ReactMarkdown
                    children={boardSnapshot.tasks[taskId].description}
                    remarkPlugins={[remarkGfm]}
                    components={components}
                  />
                </div>
              )}
            {!boardSnapshot.tasks[taskId].description &&
              !isEditingDescription && (
                <p className="text-muted-foreground text-sm">нет описания</p>
              )}
            {isEditingDescription && (
              <Textarea
                className="resize-none mb-3 field-sizing-content"
                id="description"
                placeholder="описание задачи"
                defaultValue={boardSnapshot.tasks[taskId].description}
                onChange={(e) => {
                  boardStore.tasks[taskId].description = e.target.value;

                  if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                  }

                  timeoutRef.current = setTimeout(() => {
                    updateTask(taskId, {
                      description: e.target.value,
                    });
                  }, 1000);
                }}
                onBlur={() => {
                  setIsEditingDescription(false);
                }}
              />
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
