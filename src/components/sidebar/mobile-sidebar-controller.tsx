"use client";

import { useEffect } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

export function MobileSidebarController() {
  const { setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      setOpenMobile(true);
    }
  }, [isMobile, setOpenMobile]);

  return null;
}
