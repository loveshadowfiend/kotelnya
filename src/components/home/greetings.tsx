"use client";

import { userStore } from "@/stores/user-store";
import { useSnapshot } from "valtio";
import { Skeleton } from "../ui/skeleton";

export function Greetings() {
  const userSnapshot = useSnapshot(userStore);

  if (userSnapshot.user === null) {
    return (
      <div className="flex mt-16 mb-8 items-center gap-3">
        <span className="text-3xl">привет, </span>
        <Skeleton className="h-8 w-24" />
      </div>
    );
  }

  return (
    <span className="text-3xl mt-16 mb-8">
      привет, {userSnapshot.user?.username}!
    </span>
  );
}
