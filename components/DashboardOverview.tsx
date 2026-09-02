"use client";

import { ArrowRight, Check, Clock3, FileText, PackageCheck, TrendingUp } from "lucide-react";
import Link from "next/link";
import { AnimatedNumber } from "./AnimatedNumber";
import { useAuth } from "./AuthProvider";
import { products, useConnect } from "./ConnectProvider";
import { Button, Eyebrow, StatusBadge } from "./ui";

const progressSteps = ["Confirmée", "Préparation", "Expédition", "Livraison"];

export function DashboardOverview() {
  const { account } = useAuth();
  const { addToCart } = useConnect();
  if (!account) return null;

  const latestOrder = account.orders[0] ?? null;
  const essentials = products.filter((product) => account.favoriteIds.includes(product.id)).slice(0, 3);
  const stats = account.role === "demo"
    ? [{ label: "Commandes ce mois", value: 12, suffix: "", meta: "+ 18% vs mai", icon: PackageCheck }, { label: "Délai moyen", value: 26, suffix: "h", meta: "sur vos 90 derniers jours", icon: Clock3 }, { label: "Documents disponibles", value: 48, suffix: "", meta: "4 nouveaux ce mois", icon: FileText }]
    : [{ label: "Commandes ce mois", value: account.orders.length, suffix: "", meta: account.orders.length ? "Votre activité SOREMED" : "Votre première commande vous attend", icon: PackageCheck }, { label: "Délai moyen", value: latestOrder ? 24 : 0, suffix: latestOrder ? "h" : "", meta: latestOrder ? "sur votre activité récente" : "Disponible après votre première livraison", icon: Clock3 }, { label: "Documents disponibles", value: account.documents.length, suffix: "", meta: account.documents.length ? "Dans votre archive" : "Aucun document pour le moment", icon: FileText }];
  const displayName = account.pharmacy;

  return (
    <div className="app-content">
      <div className="app-page-header"><div><span className="app-page-kicker">29 AOÛT 2026 / BONJOUR</span><h1 className="app-page-title">Votre journée, en un coup d’œil.</h1><p className="app-page-description">Les informations qui comptent pour votre officine, réunies dans un espace simple à parcourir.</p></div><div className="app-header-action"><Link href="/connect/commander" className="btn btn-primary">Nouvelle commande <ArrowRight size={15} className="arrow" /></Link></div></div>
      <div className="dashboard-grid">
        <section className="dashboard-card welcome-card card-pad"><Eyebrow>{displayName.toUpperCase()} / {account.city.toUpperCase()}</Eyebrow><h2>Bonjour, {displayName}.</h2><p>{latestOrder ? "Votre espace est à jour. Une commande est en route pour votre officine." : "Votre espace est prêt. Aucune commande pour le moment."}</p><Link href="/connect/commander" className="btn btn-small welcome-action">{latestOrder ? "Commander à nouveau" : "Passer ma première commande"} <ArrowRight size={13} /></Link></section>
        <section className="dashboard-card next-delivery card-pad"><div className="card-label-row"><span className="card-label">Prochaine livraison</span>{latestOrder ? <StatusBadge status={latestOrder.tone}>{latestOrder.status}</StatusBadge> : <StatusBadge status="neutral">En attente</StatusBadge>}</div><div className="delivery-date">{latestOrder?.delivery ?? "Aucune livraison planifiée"}<span>{latestOrder ? `${latestOrder.address} · ${account.city}` : "Votre prochaine commande apparaîtra ici."}</span></div><div className="delivery-route"><span>{latestOrder ? "Entrepôt SOREMED" : "Votre espace"}</span><i className="route-line" /><PackageCheck size={15} color="var(--green)" /><span>{latestOrder ? "Votre officine" : "À activer"}</span></div></section>
        <div className="dashboard-stats dashboard-full">{stats.map(({ label, value, suffix, meta, icon: Icon }) => <section className="dashboard-card stat-card card-pad" key={label}><div className="card-label-row"><span className="card-label">{label}</span><Icon size={15} color="var(--green)" /></div><div className="stat-value"><AnimatedNumber value={value} suffix={suffix} /></div><div className="stat-meta"><TrendingUp size={11} style={{ verticalAlign: "-2px", marginRight: 4 }} />{meta}</div></section>)}</div>
      </div>
      <div className="dashboard-two-col">
        {latestOrder ? <section className="dashboard-card order-card card-pad"><div className="order-card-heading"><div><span className="order-id">#{latestOrder.id}</span><h2 className="order-title">Commande en cours</h2><p className="order-meta">Passée le {latestOrder.date} · {latestOrder.items}</p></div><StatusBadge status={latestOrder.tone}>{latestOrder.status}</StatusBadge></div><div className="order-progress">{progressSteps.map((label, index) => <div className={`order-step ${index < latestOrder.stage ? "done" : ""} ${index === latestOrder.stage ? "active" : ""}`} key={label}><span className="order-step-dot">{index < latestOrder.stage ? <Check size={11} /> : index === latestOrder.stage ? <span className="signal-dot" /> : "·"}</span><span>{label}</span></div>)}</div><div className="order-foot"><span>Arrivée estimée <strong style={{ color: "var(--ink)" }}>{latestOrder.delivery}</strong></span><Link href={`/connect/commandes/${latestOrder.id.toLowerCase()}`} className="card-link">Voir le suivi <ArrowRight size={13} /></Link></div></section> : <section className="dashboard-card order-card card-pad empty-dashboard-card"><Eyebrow>VOTRE PREMIÈRE COMMANDE</Eyebrow><h2 className="order-title">Aucune commande pour le moment.</h2><p className="order-meta">Votre suivi commencera ici dès que votre première commande sera confirmée.</p><Link href="/connect/commander" className="btn btn-small btn-secondary">Choisir mes références <ArrowRight size={13} /></Link></section>}
        <section className="dashboard-card reorder-card card-pad"><div className="card-label-row"><span className="card-label">Vos essentiels</span><Link href="/connect/favoris" className="card-link">Voir tout <ArrowRight size={13} /></Link></div>{essentials.length ? <div className="product-mini-list">{essentials.map((product) => <div className="product-mini" key={product.id}><span className="product-thumb">{product.initials}</span><span><strong>{product.name}</strong><span>{product.lab}</span></span><Button small variant="quiet" onClick={() => addToCart(product)} aria-label={`Ajouter ${product.name}`}><ArrowRight size={14} /></Button></div>)}</div> : <div className="empty-state empty-dashboard-card"><FileText size={22} /><h3>Aucun favori pour le moment</h3><p>Ajoutez vos références habituelles pour les retrouver ici.</p><Link href="/connect/commander" className="card-link">Découvrir le catalogue <ArrowRight size={13} /></Link></div>}</section>
        <section className="dashboard-card card-pad"><div className="card-label-row"><span className="card-label">Activité récente</span><Link href="/connect/commandes" className="card-link">Tout voir <ArrowRight size={13} /></Link></div>{account.activity.length ? <div className="activity-list">{account.activity.slice(0, 4).map((item) => <div className="activity-row" key={`${item.title}-${item.meta}`}><span className="activity-dot" /><span><strong>{item.title}</strong><span>{item.meta}</span></span><span className="activity-time">{item.time}</span></div>)}</div> : <div className="empty-state empty-dashboard-card"><Clock3 size={22} /><h3>Aucune activité récente</h3><p>Les événements de votre espace apparaîtront ici.</p></div>}</section>
      </div>
    </div>
  );
}
