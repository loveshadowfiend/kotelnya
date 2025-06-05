"use client";

import React from "react";
import sadCat from "../../public/sad-cat.jpg";
import Image from "next/image";

import Screensaver from "@/fancy/components/blocks/screensaver";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  const containerRef = React.useRef<HTMLDivElement>(null);

  return (
    <div
      className="w-dvw h-screen bg-background overflow-hidden flex items-center justify-center relative text-foreground"
      ref={containerRef}
    >
      <div className="flex flex-col items-center justify-center">
        <h1 className="z-30 text-3xl md:text-6xl font-overused-grotesk text-foreground">
          страница не найдена
        </h1>
        <Link className="z-30 flex items-center gap-1 hover:underline" href="/">
          <ArrowLeft className="w-4 h-4" />
          <span>домой</span>
        </Link>
      </div>
      <Screensaver
        speed={3}
        startPosition={{ x: 0, y: 0 }}
        startAngle={40}
        containerRef={containerRef as React.RefObject<HTMLDivElement>}
      >
        <div className="w-20 md:w-48 overflow-hidden">
          <Image src={sadCat} width={640} height={500} alt="sad cat" />
        </div>
      </Screensaver>
    </div>
  );
}
