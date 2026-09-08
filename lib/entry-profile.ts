/** Opt-in browser diagnostic. No sampling runs on ordinary visits. */
export function profileEntry() {
  if (document.querySelector("[data-entry-profile]")) return;
  const output = document.createElement("output");
  output.hidden = true;
  output.dataset.entryProfile = "running";
  document.body.append(output);
  const frames: Record<string, number[]> = { ready: [], entering: [], entered: [] };
  const tasks: number[] = [];
  const started = performance.now();
  let previous = started;
  let frame = 0;
  const observer = new PerformanceObserver(list => {
    for (const entry of list.getEntries()) tasks.push(entry.duration);
  });
  if (PerformanceObserver.supportedEntryTypes.includes("longtask")) observer.observe({ type: "longtask" });
  function sample(now: number) {
    const phase = document.querySelector<HTMLElement>("[data-entry-phase]")?.dataset.entryPhase ?? "entered";
    frames[phase]?.push(now - previous);
    previous = now;
    if (now - started < 16000) { frame = requestAnimationFrame(sample); return; }
    observer.disconnect();
    output.dataset.entryProfile = "complete";
    output.textContent = JSON.stringify({
      durationMs: Math.round(now - started), visibility: document.visibilityState,
      viewport: { width: innerWidth, height: innerHeight, dpr: devicePixelRatio },
      phases: Object.fromEntries(Object.entries(frames).map(([phase, values]) => {
        const sorted = values.slice().sort((a, b) => a - b);
        return [phase, { samples: values.length, meanMs: values.length ? values.reduce((a,b)=>a+b,0)/values.length : 0,
          p95Ms: sorted[Math.floor(sorted.length * .95)] ?? 0, maxMs: sorted.at(-1) ?? 0,
          over33ms: values.filter(value => value > 33.4).length }];
      })), longTasks: tasks,
    });
  }
  frame = requestAnimationFrame(sample);
  // Keep sampling after the gate unmounts so the reveal's destination is measured.
  window.addEventListener("pagehide", () => { cancelAnimationFrame(frame); observer.disconnect(); }, { once: true });
}
