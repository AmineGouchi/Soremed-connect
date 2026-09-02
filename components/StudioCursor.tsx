"use client";

import { useEffect, useRef } from "react";

export function StudioCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const cursor = cursorRef.current;
    const label = labelRef.current;
    if (!cursor || !label) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let targetX = x;
    let targetY = y;
    let frame = 0;
    let visible = false;

    const render = () => {
      x += (targetX - x) * .18;
      y += (targetY - y) * .18;
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      frame = requestAnimationFrame(render);
    };
    const setContext = (event: PointerEvent) => {
      const element = event.target instanceof Element ? event.target : null;
      const interactive = element?.closest<HTMLElement>("[data-cursor]");
      const context = interactive?.dataset.cursor ?? "";
      cursor.classList.toggle("is-focus", Boolean(context));
      label.textContent = context;
    };
    const onMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (!visible) {
        visible = true;
        cursor.classList.add("is-visible");
      }
      setContext(event);
    };
    const onOut = (event: PointerEvent) => {
      const next = event.relatedTarget instanceof Element ? event.relatedTarget : null;
      if (!next?.closest("[data-cursor]")) cursor.classList.remove("is-focus");
    };
    const onDown = () => cursor.classList.add("is-pressed");
    const onUp = () => cursor.classList.remove("is-pressed");
    const onLeave = () => { visible = false; cursor.classList.remove("is-visible", "is-focus"); };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", setContext, { passive: true });
    window.addEventListener("pointerout", onOut, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    frame = requestAnimationFrame(render);
    document.body.classList.add("has-studio-cursor");
    return () => {
      cancelAnimationFrame(frame);
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
