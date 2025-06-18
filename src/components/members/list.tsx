"use client";

import { useSnapshot } from "valtio";
import { MemberCard } from "./card";
import { projectStore } from "@/stores/project-store";
import { Skeleton } from "../ui/skeleton";

export function MembersList() {
  const projectSnapshot = useSnapshot(projectStore);

  if (projectSnapshot.project === undefined) {
    return (
      <div className="w-full">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="w-full h-23 mb-3" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 w-full">
      {projectSnapshot.project?.users.map((user) => (
        <MemberCard key={user._id} user={user.userId} role={user.role} />
      ))}
    </div>
  );
}
