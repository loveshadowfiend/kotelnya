"use client";

import { Editor } from "@/components/note/editor/editor";
import { NoteBreadcrumb } from "@/components/note/breadcrumb";

export default function NotePage() {
  return (
    <main className="w-full">
      <NoteBreadcrumb />
      <Editor />
    </main>
  );
}
