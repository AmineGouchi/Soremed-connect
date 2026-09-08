"use client";

import { useEffect, useRef } from "react";

export function StudioCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const enabled = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 768px)");
    if (!enabled.matches) return;
    const cursor = cursorRef.current;
    const label = labelRef.current;
    if (!cursor || !label) return;

    let visible = false;
    let currentContext = "";

    const setContext = (event: PointerEvent) => {
      const element = event.target instanceof Element ? event.target : null;
      const interactive = element?.closest<HTMLElement>("[data-cursor]");
      const context = interactive?.dataset.cursor ?? "";
      if (context === currentContext) return;
      currentContext = context;
      cursor.classList.toggle("is-focus", Boolean(context));
      label.textContent = context;
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch" || !enabled.matches) return;
      // The primary pointer is immediate. Only its contextual ring animates.
      cursor.style.transform = `translate3d(${event.clientX - 9}px, ${event.clientY - 9}px, 0)`;
      if (!visible) {
        visible = true;
        cursor.classList.add("is-visible");
      }
    };
    const onOut = (event: PointerEvent) => {
      const next = event.relatedTarget instanceof Element ? event.relatedTarget : null;
      if (!next?.closest("[data-cursor]")) {
        currentContext = "";
        label.textContent = "";
        cursor.classList.remove("is-focus");
      }
    };
    const onDown = () => cursor.classList.add("is-pressed");
    const onUp = () => cursor.classList.remove("is-pressed");
    const onLeave = () => { visible = false; currentContext = ""; cursor.classList.remove("is-visible", "is-focus", "is-pressed"); };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", setContext, { passive: true });
    window.addEventListener("pointerout", onOut, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.body.classList.add("has-studio-cursor");
    return () => {
      document.body.classList.remove("has-studio-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", setContext);
      window.removeEventListener("pointerout", onOut);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <div ref={cursorRef} className="studio-cursor" aria-hidden="true"><span className="studio-cursor-dot" /><span ref={labelRef} className="studio-cursor-label" /></div>;
}
