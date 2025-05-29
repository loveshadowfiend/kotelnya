import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

export function SyncedPlugin({ isSynced }: { isSynced: boolean }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.setEditable(isSynced);
  }, [editor, isSynced]);

  return null;
}
