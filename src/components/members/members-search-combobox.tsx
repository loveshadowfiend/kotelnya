"use client";

import * as React from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { searchUsers } from "@/api/users/route";
import { User } from "@/types";
import { Avatar, AvatarImage } from "../ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { useEffect, useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { useSnapshot } from "valtio";
import { projectStore } from "@/stores/project-store";
import { toast } from "sonner";
import { addProjectMember } from "@/api/projects/route";

export function MembersSearchCombobox() {
  const projectSnapshot = useSnapshot(projectStore);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [commandInput, setCommandInput] = useState<string>("");
  const [results, setResults] = useState<User[]>([]);

  const addUserToProject = async (user: User) => {
    if (!projectSnapshot.project) return;

    setIsAdding(true);

    toast.promise(addProjectMember(projectSnapshot.project._id, user._id), {
      loading: "Добавление пользователя...",
      success: () => {
        projectStore.project?.users.push(user);

        return `Пользователь ${user.username} добавлен в проект`;
      },
      error: "Не удалось добавить пользователя",
    });

    setIsAdding(false);
  };

  useEffect(() => {
    const apiSearch = async (searchQuery: string) => {
      if (searchQuery === "") {
        setResults([]);
        return;
      }

      setIsLoading(true);

      const response = await searchUsers(searchQuery);

      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        setResults([]);
      }

      setIsLoading(false);
    };

    apiSearch(commandInput);
  }, [commandInput]);

  return (
    <Command className="rounded-lg border shadow-none" shouldFilter={false}>
      <CommandInput
        placeholder="введите имя пользователя / почту"
        value={commandInput}
        onValueChange={setCommandInput}
      />
      <CommandList>
        <CommandEmpty className="flex items-center justify-center text-sm py-8 text-muted-foreground">
          {!isLoading &&
            commandInput === "" &&
            "начните вводить имя пользователя или почту..."}
          {isLoading && <Loader2 className="animate-spin h-5 w-5" />}
          {!isLoading &&
            commandInput !== "" &&
            results.length === 0 &&
            "ничего не найдено"}
        </CommandEmpty>
        <CommandGroup>
          {results.map((result) => (
            <CommandItem
              className="py-4 px-4 space-x-2"
              key={result._id}
              value={result._id}
            >
              <Avatar className="rounded-full">
                <AvatarImage src="https://sun9-49.userapi.com/impg/KHzTpEa-GfO-WkmJASroLY0XdnB9OwjMnNN32Q/hmIDDvT9UbU.jpg?size=372x372&quality=95&sign=5e4d1a8a253e0def82b79e85f341f64f&type=album" />
                <AvatarFallback className="rounded-lg" />
              </Avatar>
              <div className="flex w-full justify-between items-center">
                <div className="flex flex-col justify-center">
                  <span> {result.username}</span>
                  <span className="text-muted-foreground">{result.email}</span>
                </div>
                <Button
                  className="text-sm"
                  disabled={
                    projectSnapshot.project?.users
                      .map((user: User) => user._id)
                      .includes(result._id) || isAdding
                  }
                  onClick={() => addUserToProject(result)}
                >
                  <Plus /> Добавить
                </Button>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
