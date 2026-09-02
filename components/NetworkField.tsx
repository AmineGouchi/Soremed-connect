"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";

const nodes = [
  { x: 15, y: 27, label: "Casablanca" },
  { x: 84, y: 30, label: "Rabat" },
  { x: 78, y: 78, label: "Marrakech" },
  { x: 16, y: 73, label: "Agadir" },
];

export function NetworkField() {
  const area = useRef<HTMLDivElement>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(pointerY, { stiffness: 80, damping: 18 });
  const rotateY = useSpring(pointerX, { stiffness: 80, damping: 18 });

  function onMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!area.current) return;
    const rect = area.current.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left - rect.width / 2) / 22);
    pointerY.set(-(event.clientY - rect.top - rect.height / 2) / 30);
  }

  function onLeave() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <div ref={area} className="network-stage" onMouseMove={onMove} onMouseLeave={onLeave}>
      <motion.div className="network-panel" style={{ rotateX, rotateY }}>
        <div className="network-grid" />
        <svg className="network-lines" viewBox="0 0 540 440" aria-hidden="true">
          <path className="network-line" d="M80 120 L270 220 L454 132" fill="none" />
          <path className="network-line" d="M270 220 L422 342" fill="none" />
          <path className="network-line" d="M270 220 L86 320" fill="none" />
          <path className="network-line" d="M80 120 L86 320" fill="none" />
          <path className="network-line" d="M454 132 L422 342" fill="none" />
          <motion.circle cx="270" cy="220" r="78" fill="none" stroke="rgba(28,122,92,.12)" strokeWidth="1" strokeDasharray="2 7" animate={{ rotate: 360 }} transition={{ duration: 24, repeat: Infinity, ease: "linear" }} />
        </svg>
        {nodes.map((node, index) => (
          <motion.div
            key={node.label}
            className={`network-node node-${index + 1}`}
            animate={{ y: [0, index % 2 === 0 ? -5 : 5, 0] }}
            transition={{ duration: 4 + index, repeat: Infinity, ease: "easeInOut", delay: index * .3 }}
          >
            {node.label}
          </motion.div>
        ))}
        <div className="network-core">
          <div className="core-ring" />
          <div className="core-inner"><div><small>PLATEFORME</small><strong>CONNECT</strong></div></div>
        </div>
        <div className="network-caption"><strong>Un réseau, une même précision.</strong>Coordination en temps réel</div>
        <div className="network-signal"><i className="signal-dot" /> LIVE / MAROC</div>
      </motion.div>
    </div>
  );
}
