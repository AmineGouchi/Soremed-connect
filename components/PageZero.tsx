"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./PageZero.module.css";
import { OfficialLogo } from "./ui";

type Props = { onEntering: () => void; onEntered: () => void };

/** A user-operated gate, not a loader. Only enter() starts the exit animation. */
export function PageZero({ onEntering, onEntered }: Props) {
  const [phase, setPhase] = useState<"ready" | "entering">("ready");
  const sceneRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLHeadingElement>(null);
  const portalRef = useRef<HTMLButtonElement>(null);
  const committed = useRef(false);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const previous = [html.style.overflow, body.style.overflow, body.style.touchAction];
    html.style.overflow = body.style.overflow = "hidden";
    body.style.touchAction = "none";
    sceneRef.current?.focus({ preventScroll: true });
    return () => {
      html.style.overflow = previous[0];
      body.style.overflow = previous[1];
      body.style.touchAction = previous[2];
    };
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;
    const world = worldRef.current;
    const light = lightRef.current;
    const glass = glassRef.current;
    const word = wordRef.current;
    const portal = portalRef.current;
    if (!scene || !world || !light || !glass || !word || !portal || phase !== "ready") return;

    const finePointer = matchMedia("(hover: hover) and (pointer: fine) and (min-width: 768px) and (prefers-reduced-motion: no-preference)");
    const letters = Array.from(word.querySelectorAll<HTMLElement>("[data-letter]"));
    let bounds = scene.getBoundingClientRect();
    let wordBounds = word.getBoundingClientRect();
    let portalBounds = portal.getBoundingClientRect();
    let letterBounds = letters.map(letter => letter.getBoundingClientRect());
    let frame = 0;
    let pointer = { x: bounds.width / 2, y: bounds.height / 2, inside: false };

    // Read geometry on resize/font load, never inside pointermove or render.
    const measure = () => {
      bounds = scene.getBoundingClientRect();
      wordBounds = word.getBoundingClientRect();
      portalBounds = portal.getBoundingClientRect();
      letterBounds = letters.map(letter => letter.getBoundingClientRect());
    };
    const render = () => {
      frame = 0;
      const enabled = finePointer.matches && pointer.inside;
      const nx = enabled ? (pointer.x - bounds.left) / bounds.width * 2 - 1 : 0;
      const ny = enabled ? (pointer.y - bounds.top) / bounds.height * 2 - 1 : 0;
      world.style.transform = `translate3d(${nx * -2}px, ${ny * -2}px, 0)`;
      glass.style.transform = `translate3d(${nx * 4}px, ${ny * 3}px, 0)`;
      // Fixed-size, pre-rasterized radial light: transform only, zero damping.
      light.style.transform = `translate3d(${pointer.x - bounds.left - 240}px, ${pointer.y - bounds.top - 240}px, 0)`;
      light.style.opacity = enabled ? "1" : "0";

      const overWord = enabled && pointer.y > wordBounds.top && pointer.y < wordBounds.bottom;
      letters.forEach((letter, index) => {
        const rect = letterBounds[index];
        const distance = Math.abs(pointer.x - (rect.left + rect.width / 2));
        const proximity = overWord ? Math.max(0, 1 - distance / (rect.width * 1.2)) : 0;
        letter.style.transform = `translate3d(0, ${-2.5 * proximity}px, 0)`;
        letter.style.setProperty("--letter-light", String(proximity * .75));
      });

      const dx = pointer.x - portalBounds.left - portalBounds.width / 2;
      const dy = pointer.y - portalBounds.top - portalBounds.height / 2;
      const near = enabled && Math.abs(dx) < portalBounds.width / 2 + 22 && Math.abs(dy) < portalBounds.height / 2 + 22;
      portal.dataset.near = String(near);
      portal.style.transform = near ? `translate3d(${Math.max(-4, Math.min(4, dx * .026))}px, ${Math.max(-3, Math.min(3, dy * .06))}px, 0)` : "translate3d(0,0,0)";
    };
    const requestRender = () => { if (!frame) frame = requestAnimationFrame(render); };
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch" || !finePointer.matches) return;
      pointer = { x: event.clientX, y: event.clientY, inside: true };
      requestRender();
    };
    const leave = () => { pointer.inside = false; requestRender(); };
    const resize = new ResizeObserver(measure);
    resize.observe(scene);
    resize.observe(word);
    resize.observe(portal);
    // The initial reveal uses a transform; measure settled geometry as well.
    word.addEventListener("animationend", measure);
    scene.addEventListener("pointermove", move, { passive: true });
    scene.addEventListener("pointerleave", leave);
    finePointer.addEventListener("change", leave);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      word.removeEventListener("animationend", measure);
      scene.removeEventListener("pointermove", move);
      scene.removeEventListener("pointerleave", leave);
      finePointer.removeEventListener("change", leave);
    };
  }, [phase]);

  function enter() {
    if (committed.current) return;
    committed.current = true;
    // Start the aperture at the actual control, including at short viewports.
    const scene = sceneRef.current;
    const portal = portalRef.current;
    if (scene && portal) {
      const rect = portal.getBoundingClientRect();
      const origin = rect.top + rect.height / 2;
      const radius = Math.hypot(scene.clientWidth / 2, Math.max(origin, scene.clientHeight - origin)) + 4;
      scene.style.setProperty("--entry-origin-y", `${origin}px`);
      scene.style.setProperty("--entry-aperture-target", `${radius}px`);
    }
    setPhase("entering");
    onEntering();
  }

  return (
    <div ref={sceneRef} className={styles.gate} data-entry-phase={phase} role="dialog" tabIndex={-1} aria-modal="true" aria-labelledby="entry-title" aria-describedby="entry-description" aria-busy={phase === "entering"}
      onKeyDown={event => {
        if (event.key === "Tab") { event.preventDefault(); portalRef.current?.focus({ preventScroll: true }); }
      }}>
      <div className={styles.environment} onAnimationEnd={event => {
        // An idle/reveal animation cannot dismiss this gate, ever.
        if (event.target === event.currentTarget && phase === "entering" && committed.current) onEntered();
      }}>
        <div className={styles.world} ref={worldRef} aria-hidden="true">
          <picture>
            <source media="(max-width: 767px)" srcSet="/visuals/soremed-distribution-mobile.webp" />
            <img className={styles.backdrop} src="/visuals/soremed-distribution.webp" alt="" width="1672" height="941" fetchPriority="high" decoding="async" />
          </picture>
        </div>
        <div className={styles.shade} aria-hidden="true" />
        <div className={styles.glassEdge} ref={glassRef} aria-hidden="true" />
        <div className={styles.light} ref={lightRef} aria-hidden="true" />
        <div className={styles.topline}>
          <OfficialLogo surface="dark" className={styles.logo} />
          <span>Au service des pharmacies.</span>
        </div>
        <div className={styles.invitation}>
          <p>Vous voulez gagner du temps ?</p>
          <button className={styles.portal} ref={portalRef} type="button" onClick={enter} aria-disabled={phase === "entering"} aria-label="Entrer dans l’expérience" data-cursor="ENTRER">
            <span className={styles.controlContent}>
              <span className={styles.labelMask} aria-hidden="true">
                <span className={styles.labelRest}>Entrer dans l’expérience</span>
                <span className={styles.labelHover}>Explorer SOREMED</span>
              </span>
              <ArrowRight size={19} strokeWidth={1.4} aria-hidden="true" />
            </span>
          </button>
        </div>
        <div className={styles.footnote}>
          <p id="entry-description">Un espace pensé pour simplifier<br />le quotidien des pharmacies.</p>
          <span>La proximité, en mouvement.</span>
        </div>
      </div>
      <h1 id="entry-title" ref={wordRef} className={styles.word} aria-label="SOREMED">
        {["SORE", "MED"].map((group, groupIndex) => <span className={styles.wordGroup} key={group} aria-hidden="true">
          {Array.from(group).map((letter, index) => <span className={styles.letterExit} key={`${group}-${index}`} style={{ "--letter-order": index + groupIndex * 4 } as CSSProperties}><span data-letter={letter} className={styles.letter}>{letter}</span></span>)}
        </span>)}
      </h1>
    </div>
  );
}
