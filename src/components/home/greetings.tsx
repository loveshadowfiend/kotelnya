"use client";

import { userStore } from "@/stores/user-store";
import { useSnapshot } from "valtio";
import { Skeleton } from "../ui/skeleton";

function getGreetingByTime() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "доброе утро";
  if (hour >= 12 && hour < 18) return "добрый день";
  if (hour >= 18 && hour < 23) return "добрый вечер";
  return "доброй ночи";
}

export function Greetings() {
  const userSnapshot = useSnapshot(userStore);
  const greetings = getGreetingByTime();

  if (userSnapshot.user === null) {
    return (
      <div className="flex mt-28 mb-8 items-center gap-3">
        <span className="text-3xl">{greetings}, </span>
        <Skeleton className="h-8 w-24" />
      </div>
    );
  }

  return (
    <span className="text-3xl mt-28 mb-8">
      {greetings}, {userSnapshot.user?.username}!
    </span>
  );
}
