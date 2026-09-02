"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bell, ChevronRight, FileText, Heart, LayoutGrid, Menu, PackageSearch, Settings2, ShoppingBasket, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthProvider";
import { useConnect } from "./ConnectProvider";
import { Wordmark } from "./ui";

const navItems = [
  { href: "/connect", label: "Vue d’ensemble", icon: LayoutGrid },
  { href: "/connect/commander", label: "Commander", icon: ShoppingBasket },
  { href: "/connect/commandes", label: "Mes commandes", icon: PackageSearch },
  { href: "/connect/documents", label: "Mes documents", icon: FileText },
  { href: "/connect/favoris", label: "Favoris", icon: Heart },
];

export function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast, notify } = useConnect();
  const { account, hydrated } = useAuth();

  useEffect(() => {
    if (hydrated && !account) router.replace(`/connexion?next=${encodeURIComponent(pathname)}`);
  }, [account, hydrated, pathname, router]);

  const initials = useMemo(() => account?.pharmacy.split(/\s+/).map((word) => word[0]).join("").slice(0, 2).toUpperCase() || "PA", [account?.pharmacy]);

  if (!hydrated || !account) {
    return <main className="auth-gate"><span className="signal-dot" /><p>Préparation de votre espace sécurisé…</p></main>;
  }

  return (
    <div className="app-shell">
      <AnimatePresence>{toast && <motion.div className="toast" role="status" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}><Bell size={15} /> {toast}</motion.div>}</AnimatePresence>
      <aside className={`app-sidebar ${sidebarOpen ? "open" : ""}`}>
        <Link href="/" onClick={() => setSidebarOpen(false)}><Wordmark /></Link>
        <p className="sidebar-label">Espace pharmacie</p>
        <nav className="app-nav" aria-label="Navigation de l’espace client">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = href === "/connect" ? pathname === href : pathname.startsWith(href);
            return <Link key={href} href={href} className={`app-nav-link ${active ? "active" : ""}`} onClick={() => setSidebarOpen(false)}><Icon /> <span>{label}</span></Link>;
          })}
        </nav>
        <div className="app-nav-divider" />
        <p className="sidebar-label">Compte</p>
        <nav className="app-nav"><Link href="/connect/compte" className={`app-nav-link ${pathname.startsWith("/connect/compte") ? "active" : ""}`} onClick={() => setSidebarOpen(false)}><Settings2 /> <span>Mon compte</span></Link></nav>
        <div className="sidebar-bottom"><strong>Besoin d’aide ?</strong><p>Notre équipe est disponible pour vous accompagner.</p><button className="card-link" style={{ marginTop: 11 }} onClick={() => notify("Notre équipe va revenir vers vous.")}>Contacter SOREMED <ChevronRight size={13} /></button></div>
      </aside>
      <div className="app-main">
        <header className="app-topbar"><div className="breadcrumb"><button className="icon-btn mobile-menu-btn" aria-label={sidebarOpen ? "Fermer le menu" : "Ouvrir le menu"} onClick={() => setSidebarOpen((value) => !value)}>{sidebarOpen ? <X size={17} /> : <Menu size={17} />}</button><span>SOREMED Connect</span><ChevronRight size={13} /><strong>{pathname === "/connect" ? "Vue d’ensemble" : pathname.includes("commander") ? "Commander" : pathname.includes("documents") ? "Mes documents" : pathname.includes("favoris") ? "Favoris" : pathname.includes("compte") ? "Mon compte" : "Mes commandes"}</strong></div><div className="topbar-actions"><span className="topbar-status"><i className="signal-dot" /> espace sécurisé</span><button className="icon-btn" aria-label="Notifications" onClick={() => notify("Aucune nouvelle notification.")}><Bell size={16} /></button><Link href="/connect/compte" className="topbar-avatar" aria-label="Ouvrir mon compte">{initials}</Link></div></header>
        <main>{children}</main>
      </div>
      {sidebarOpen && <button className="modal-scrim" style={{ zIndex: 15, background: "rgba(13,33,29,.18)" }} aria-label="Fermer le menu" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}
