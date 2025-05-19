"use client";

import { useSnapshot } from "valtio";
import { MemberCard } from "./card";
import { projectStore } from "@/stores/project-store";

export function MembersList() {
  const projectSnapshot = useSnapshot(projectStore);

  return (
    <div className="w-full">
      <MemberCard />
    </div>
  );
}
