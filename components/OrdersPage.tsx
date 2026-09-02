"use client";

import { ArrowRight, Check, Clock3, PackageCheck } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useAuth } from "./AuthProvider";
import { Eyebrow, StatusBadge } from "./ui";

export function OrdersPage() {
  const { account } = useAuth();
  const [period, setPeriod] = useState("Toutes les périodes");
  const orders = account?.orders ?? [];
  const visibleOrders = useMemo(() => period === "Ce mois" ? orders.slice(0, 3) : period === "Mai 2026" ? orders.filter((order) => order.date.includes("mai 2026")) : orders, [orders, period]);

  return (
    <div className="app-content">
      <div className="app-page-header"><div><span className="app-page-kicker">HISTORIQUE / 90 DERNIERS JOURS</span><h1 className="app-page-title">Vos commandes, sans zone grise.</h1><p className="app-page-description">Retrouvez chaque commande, son statut et le détail de son passage dans le réseau SOREMED.</p></div><div className="app-header-action"><Link href="/connect/commander" className="btn btn-primary">Nouvelle commande <ArrowRight size={15} /></Link></div></div>
      <div className="dashboard-stats"><section className="dashboard-card stat-card card-pad"><div className="card-label-row"><span className="card-label">Commandes livrées</span><PackageCheck size={15} color="var(--green)" /></div><div className="stat-value">{account?.role === "demo" ? 34 : orders.filter((order) => order.tone === "success").length}</div><div className="stat-meta">{account?.role === "demo" ? "98,4% dans le délai annoncé" : "Depuis l’activation de votre espace"}</div></section><section className="dashboard-card stat-card card-pad"><div className="card-label-row"><span className="card-label">En cours</span><Clock3 size={15} color="var(--amber)" /></div><div className="stat-value">{orders.filter((order) => order.tone === "info").length.toString().padStart(2, "0")}</div><div className="stat-meta" style={{ color: "var(--amber)" }}>{orders.some((order) => order.tone === "info") ? "Prochaine étape : expédition" : "Aucune commande en cours"}</div></section><section className="dashboard-card stat-card card-pad"><div className="card-label-row"><span className="card-label">Taux de réassort</span><Check size={15} color="var(--green)" /></div><div className="stat-value">{account?.role === "demo" ? 72 : orders.length ? 100 : 0}<span style={{ fontSize: 16 }}>%</span></div><div className="stat-meta">{account?.role === "demo" ? "sur vos références favorites" : "Sur votre activité SOREMED"}</div></section></div>
      <section className="table-card" style={{ marginTop: 16 }}><div className="table-toolbar"><Eyebrow>LISTE DES COMMANDES</Eyebrow><div className="table-toolbar-actions"><select className="filter-select" value={period} onChange={(event) => setPeriod(event.target.value)} aria-label="Filtrer par période"><option>Toutes les périodes</option><option>Ce mois</option><option>Mai 2026</option></select></div></div>{visibleOrders.length === 0 ? <div className="empty-state"><PackageCheck size={28} /><h3>Aucune commande pour le moment</h3><p>Votre prochaine commande apparaîtra ici, avec son statut et son historique.</p><Link href="/connect/commander" className="card-link">Passer ma première commande <ArrowRight size={13} /></Link></div> : <table className="product-table"><thead><tr><th>Commande</th><th>Date</th><th>Références</th><th>Montant HT</th><th>Statut</th><th /></tr></thead><tbody>{visibleOrders.map((order) => <tr key={order.id}><td><span className="table-ref">#{order.id}</span></td><td>{order.date}</td><td>{order.items}</td><td style={{ color: "var(--ink)", fontWeight: 700 }}>{order.total}</td><td><StatusBadge status={order.tone}>{order.status}</StatusBadge></td><td style={{ textAlign: "right" }}><Link href={`/connect/commandes/${order.id.toLowerCase()}`} className="card-link">Voir le détail <ArrowRight size={13} /></Link></td></tr>)}</tbody></table>}</section>
    </div>
  );
}
