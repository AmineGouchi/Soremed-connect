"use client";

import { ArrowLeft, Check, Clock3, MapPin, Package, Truck } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "./AuthProvider";
import { useConnect } from "./ConnectProvider";
import { Button, Eyebrow, StatusBadge } from "./ui";

const stageCopy = [
  ["Commande reçue", "Votre commande a été enregistrée par SOREMED."],
  ["Préparation", "Nos équipes vérifient et regroupent vos références."],
  ["Expédition", "Votre colis est remis au transporteur partenaire."],
  ["Livraison", "Livraison prévue à votre officine."],
] as const;
const stageIcons = [Check, Package, Truck, MapPin];

export function TrackingPage({ orderId }: { orderId?: string }) {
  const { account } = useAuth();
  const { notify } = useConnect();
  const order = account?.orders.find((entry) => entry.id.toLowerCase() === orderId?.toLowerCase()) ?? account?.orders[0];

  if (!order) {
    return <div className="app-content"><div className="empty-state page-empty-state"><Package size={30} /><h1>Commande introuvable.</h1><p>Cette commande n’est pas encore associée à votre espace.</p><Link href="/connect/commander" className="card-link">Passer une commande <ArrowLeft size={13} /></Link></div></div>;
  }

  const progress = order.stage >= 3 ? 100 : 68;
  return (
    <div className="app-content">
      <div className="app-page-header"><div><Link href="/connect/commandes" className="card-link"><ArrowLeft size={13} /> Retour aux commandes</Link><h1 className="app-page-title" style={{ marginTop: 19 }}>Suivre une commande.</h1><p className="app-page-description">Une lecture claire de ce qui se passe entre votre besoin et sa livraison.</p></div></div>
      <div className="tracking-hero"><section className="tracking-summary card-pad"><Eyebrow>COMMANDE / {order.date.toUpperCase()}</Eyebrow><h2>#{order.id}</h2><p>{account?.pharmacy} · {account?.city}</p><StatusBadge status={order.tone}>{order.status}</StatusBadge></section><section className="dashboard-card tracking-side-list card-pad"><div className="tracking-side-item"><span>Livraison estimée</span><strong>{order.delivery}</strong></div><div className="tracking-side-item"><span>Nombre de produits</span><strong>{order.items}</strong></div><div className="tracking-side-item"><span>Total indicatif HT</span><strong>{order.total}</strong></div><div className="tracking-side-item"><span>Adresse</span><strong>{order.address}</strong></div></section></div>
      <section className="dashboard-card tracking-timeline-card card-pad"><div className="card-label-row"><Eyebrow>PROGRESSION DE LA COMMANDE</Eyebrow><span className="font-mono text-muted" style={{ fontSize: 10 }}>{progress}% DU PARCOURS</span></div><div className="tracking-progress-line"><motion.span initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1.1, ease: "easeOut" }} /></div><div className="tracking-timeline">{stageCopy.map(([title, copy], index) => { const Icon = stageIcons[index]; const done = index < order.stage || order.stage >= 3; const current = index === order.stage && order.stage < 3; return <div className={`tracking-event ${done ? "is-done" : ""} ${current ? "is-current" : ""}`} key={title}><div className="tracking-event-marker"><Icon size={13} /></div><div><strong>{title}</strong><p>{index === 1 ? copy.replace("vos références", order.items.toLowerCase()) : copy}</p></div><time>{current ? "En cours" : done ? order.date : "À venir"}</time></div>; })}</div><div className="tracking-timeline-footer"><span className="text-muted" style={{ fontSize: 11 }}><Clock3 size={13} style={{ verticalAlign: "-2px", marginRight: 5 }} /> Dernière mise à jour il y a 12 min</span><Button small variant="quiet" onClick={() => notify("Vous recevrez les prochaines mises à jour de cette commande.")}>Recevoir les mises à jour</Button></div></section>
    </div>
  );
}
