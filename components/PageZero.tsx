"use client";

import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { GlassPanel } from "./GlassPanel";

type EntryPhase = "ready" | "entering" | "entered";

/**
 * The public entry gate is intentionally not a loader. It has no asset-driven
 * completion, no session shortcut and no automatic exit: only the invitation
 * button can move it into the transition state.
 */
export function PageZero() {
  const reduceMotion = useReducedMotion();
  const sceneRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const enterTimer = useRef<number | null>(null);
  const [phase, setPhase] = useState<EntryPhase>("ready");

  useEffect(() => {
    if (phase === "entered") return;

    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousBodyTouchAction = body.style.touchAction;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.touchAction = "none";

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
      body.style.touchAction = previousBodyTouchAction;
    };
  }, [phase]);

  useEffect(() => () => {
    if (enterTimer.current !== null) window.clearTimeout(enterTimer.current);
  }, []);

  function moveScene(event: ReactPointerEvent<HTMLDivElement>) {
    const scene = sceneRef.current;
    if (!scene) return;
    const rect = scene.getBoundingClientRect();
    const pointerX = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
    const pointerY = Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100));
    scene.style.setProperty("--pointer-x", `${pointerX}%`);
    scene.style.setProperty("--pointer-y", `${pointerY}%`);
    const normalizedX = (pointerX - 50) / 50;
    const normalizedY = (pointerY - 50) / 50;
    scene.style.setProperty("--parallax-bg-x", `${normalizedX * -1.5}px`);
    scene.style.setProperty("--parallax-bg-y", `${normalizedY * -1.5}px`);
    scene.style.setProperty("--parallax-mid-x", `${normalizedX * 4}px`);
    scene.style.setProperty("--parallax-mid-y", `${normalizedY * 4}px`);
    scene.style.setProperty("--parallax-fg-x", `${normalizedX * 7}px`);
    scene.style.setProperty("--parallax-fg-y", `${normalizedY * 7}px`);
  }

  function moveCta(event: ReactPointerEvent<HTMLDivElement>) {
    const cta = ctaRef.current;
    if (!cta) return;
    const rect = cta.getBoundingClientRect();
    const offsetX = Math.max(-5, Math.min(5, ((event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)) * 5));
    const offsetY = Math.max(-4, Math.min(4, ((event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)) * 4));
    cta.style.setProperty("--cta-x", `${offsetX}px`);
    cta.style.setProperty("--cta-y", `${offsetY}px`);
  }

  function resetCta() {
    const cta = ctaRef.current;
    if (!cta) return;
    cta.style.setProperty("--cta-x", "0px");
    cta.style.setProperty("--cta-y", "0px");
  }

  function enter() {
    if (phase !== "ready") return;

    setPhase("entering");
    // This timer is started exclusively by the user's click. It only hands
    // control back after the cinematic gate transition has begun.
    enterTimer.current = window.setTimeout(() => setPhase("entered"), reduceMotion ? 30 : 280);
  }

  const visible = phase !== "entered";

  return (
    <AnimatePresence mode="sync">
      {visible && (
        <motion.div
          ref={sceneRef}
          className={`page-zero ${phase === "entering" ? "is-entering" : ""}`}
          data-entry-phase={phase}
          onPointerMove={moveScene}
          initial={{ opacity: 1 }}
          animate={phase === "entering" ? { opacity: 0, clipPath: "inset(0 0 100% 0)", y: "-3%" } : { opacity: 1 }}
          exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)", y: "-3%" }}
          transition={{ duration: reduceMotion ? 0.08 : 0.72, ease: [0.22, 1, 0.36, 1] }}
          aria-label="Entrée SOREMED Connect"
          aria-busy={phase === "entering"}
        >
          <div className="page-zero-atmosphere" aria-hidden="true">
            <div className="page-zero-backdrop" />
            <div className="page-zero-ambient page-zero-ambient-left" />
            <div className="page-zero-ambient page-zero-ambient-right" />
            <div className="page-zero-mineral-floor" />
            <div className="page-zero-architecture page-zero-architecture-left"><span /><span /><span /></div>
            <div className="page-zero-architecture page-zero-architecture-right"><span /><span /><span /></div>
            <div className="page-zero-botanical botanical-left">
              <span className="botanical-stem" />
              <i className="botanical-leaf leaf-one" />
              <i className="botanical-leaf leaf-two" />
              <i className="botanical-leaf leaf-three" />
              <i className="botanical-leaf leaf-four" />
            </div>
            <div className="page-zero-botanical botanical-right">
              <span className="botanical-stem" />
              <i className="botanical-leaf leaf-one" />
              <i className="botanical-leaf leaf-two" />
              <i className="botanical-leaf leaf-three" />
            </div>
            <div className="page-zero-dust">
              <i className="dust-one" /><i className="dust-two" /><i className="dust-three" /><i className="dust-four" /><i className="dust-five" />
            </div>
          </div>
          <div className="page-zero-light" />
          <div className="page-zero-top">
            <span>SOREMED Connect</span>
            <span>Casablanca · Maroc</span>
          </div>
          <motion.div
            className="page-zero-word"
            initial={{ y: 38, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.12, duration: reduceMotion ? 0.08 : 0.85, ease: [0.22, 1, 0.36, 1] }}
            exit={{ y: "-13vh", letterSpacing: ".02em", opacity: 0.3, transition: { duration: reduceMotion ? 0.08 : 0.62 } }}
            aria-hidden="true"
          >
            <span>SORE</span>
            <span>MED</span>
          </motion.div>
          <div className="page-zero-bottom">
            <div>
              <span className="page-zero-index">01 / 01</span>
              <p>Un espace pensé pour simplifier le quotidien des pharmacies.</p>
            </div>
            <div ref={ctaRef} className="page-zero-cta-wrap" onPointerMove={moveCta} onPointerLeave={resetCta}>
              <GlassPanel className="page-zero-cta">
                <span className="page-zero-cta-kicker">Prêt à gagner du temps ?</span>
                <button onClick={enter} data-cursor="EXPLORER" aria-label="Entrer dans l’expérience SOREMED Connect">
                  <span className="page-zero-cta-label" aria-hidden="true">
                    <span className="cta-label cta-label-default">Entrer dans l’expérience</span>
                    <span className="cta-label cta-label-hover">Explorer SOREMED</span>
                  </span>
                  <ArrowRight size={15} />
                </button>
              </GlassPanel>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
