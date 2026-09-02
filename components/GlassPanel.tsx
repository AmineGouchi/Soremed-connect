"use client";

import { useRef } from "react";

export function GlassPanel({ className = "", children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  function move(event: React.PointerEvent<HTMLDivElement>) {
    const element = ref.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    element.style.setProperty("--glass-x", `${((event.clientX - rect.left) / rect.width) * 100}%`);
    element.style.setProperty("--glass-y", `${((event.clientY - rect.top) / rect.height) * 100}%`);
  }

  return <div ref={ref} className={`glass-material ${className}`} onPointerMove={move}>{children}</div>;
}
