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
import { Loader2, Mail, Plus, Send } from "lucide-react";
import { Button } from "../ui/button";
import { useSnapshot } from "valtio";
import { projectStore } from "@/stores/project-store";
import { toast } from "sonner";
import { API_URL } from "@/lib/config";
import { sendInvitation } from "@/api/invitations/route";
import { useIsMobile } from "@/hooks/use-mobile";

export function MembersSearchCombobox() {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [commandInput, setCommandInput] = useState<string>("");
  const [results, setResults] = useState<User[]>([]);
  const projectSnapshot = useSnapshot(projectStore);
  const isTabletOrMobile = useIsMobile();

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
        placeholder="имя пользователя / почта"
        value={commandInput}
        onValueChange={setCommandInput}
      />
      <CommandList>
        <CommandEmpty className="flex items-center justify-center text-sm py-8 text-muted-foreground">
          {!isLoading && commandInput === "" && (
            <span className="text-center">
              начните вводить имя пользователя {isTabletOrMobile && <br />} или
              почту...
            </span>
          )}
          {isLoading && <Loader2 className="animate-spin h-5 w-5" />}
          {!isLoading && commandInput !== "" && results.length === 0 && (
            <span>ничего не найдено</span>
          )}
        </CommandEmpty>
        <CommandGroup className="h-max">
          {results.map((result: User) => (
            <CommandItem
              className="py-4 px-4 space-x-2"
              key={result._id}
              value={result._id}
            >
              <Avatar className="rounded-lg">
                <AvatarImage src={`${API_URL}${result.avatarUrl}`} />
                <AvatarFallback className="flex items-center justify-center text-sm rounded-lg aspect-square bg-accent text-muted-foreground">
                  {result.username.substring(0, 2)}
                </AvatarFallback>
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
                      .map((user) => user.userId._id)
                      .includes(result._id) || isAdding
                  }
                  onClick={() =>
                    toast.promise(
                      sendInvitation(
                        projectSnapshot.project?._id ?? "",
                        result._id
                      ),
                      {
                        loading: "приглашение пользователя...",
                        success: async (response) => {
                          const data = await response.json();
                          return `${data.message}`;
                        },
                        error: async (response: string) => {
                          if (response.includes("400")) {
                            return "приглашение этому пользователю в этот проект уже было отправлено";
                          } else {
                            return "не удалось пригласить пользователя";
                          }
                        },
                      }
                    )
                  }
                >
                  <Mail className="text-accent" />
                  {!isTabletOrMobile && "пригласить"}
                </Button>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
