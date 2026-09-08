"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // The public gate owns its reveal; a translated ancestor would offset it.
  if (pathname === "/") return children;
  return <motion.div initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .32, ease: "easeOut" }}>{children}</motion.div>;
}
