"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

export function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    const number = numberRef.current;
    if (!inView || !number) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      number.textContent = value.toLocaleString("fr-FR");
      return;
    }
    let start: number | undefined;
    let animationFrame = 0;
    const duration = 900;
    const frame = (now: number) => {
      start ??= now;
      const progress = Math.max(0, Math.min((now - start) / duration, 1));
      const eased = 1 - Math.pow(1 - progress, 3);
      number.textContent = Math.round(value * eased).toLocaleString("fr-FR");
      if (progress < 1) animationFrame = requestAnimationFrame(frame);
    };
    animationFrame = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animationFrame);
  }, [inView, value]);

  return <motion.span ref={ref} initial={{ opacity: 0 }} animate={{ opacity: inView ? 1 : 0 }}><span ref={numberRef}>{value.toLocaleString("fr-FR")}</span>{suffix}</motion.span>;
}
