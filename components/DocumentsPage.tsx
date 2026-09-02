"use client";

import { CalendarDays, Download, FileText, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useAuth } from "./AuthProvider";
import { useConnect } from "./ConnectProvider";
import { Eyebrow, StatusBadge } from "./ui";

const tabs = ["Tous", "Factures", "Bons de livraison", "Avoirs", "Relevés"];
const periods = ["Toutes les périodes", "Juin 2026", "Mai 2026"];

export function DocumentsPage() {
  const { account } = useAuth();
  const { notify } = useConnect();
  const [tab, setTab] = useState("Tous");
  const [period, setPeriod] = useState(periods[0]);
  const [query, setQuery] = useState("");
  const documents = account?.documents ?? [];
  const filtered = useMemo(() => documents.filter((doc) => {
    const matchesTab = tab === "Tous" || doc.type === tab;
    const matchesPeriod = period === periods[0] || doc.date.toLocaleLowerCase("fr-FR").includes(period.toLocaleLowerCase("fr-FR"));
    const matchesQuery = `${doc.name} ${doc.ref}`.toLowerCase().includes(query.toLowerCase());
    return matchesTab && matchesPeriod && matchesQuery;
  }), [documents, period, query, tab]);

  return (
    <div className="app-content">
      <div className="app-page-header"><div><span className="app-page-kicker">ARCHIVE / {String(documents.length).padStart(2, "0")} DOCUMENTS</span><h1 className="app-page-title">Vos documents, au bon endroit.</h1><p className="app-page-description">Factures, bons de livraison, avoirs et relevés : une archive claire, consultable quand vous en avez besoin.</p></div><div className="app-header-action"><span className="font-mono text-muted" style={{ fontSize: 10 }}>{documents.length ? "DERNIÈRE SYNCHRO / IL Y A 8 MIN" : "ARCHIVE EN ATTENTE"}</span></div></div>
      <section className="table-card">
        <div className="documents-tabs" role="tablist">{tabs.map((item) => <button key={item} className={`documents-tab ${tab === item ? "active" : ""}`} onClick={() => setTab(item)} role="tab" aria-selected={tab === item}>{item}</button>)}</div>
        <div className="table-toolbar"><Eyebrow>{filtered.length.toString().padStart(2, "0")} DOCUMENTS</Eyebrow><div className="table-toolbar-actions"><label className="search-box"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un document…" aria-label="Rechercher un document" /></label><label className="period-control"><CalendarDays size={13} /><select className="filter-select" value={period} onChange={(event) => setPeriod(event.target.value)} aria-label="Filtrer par période">{periods.map((item) => <option key={item}>{item}</option>)}</select></label></div></div>
        {filtered.length === 0 ? <div className="empty-state"><FileText size={28} /><h3>Aucun document</h3><p>{documents.length ? "Modifiez votre recherche, votre période ou votre type de document." : "Les factures et bons de livraison apparaîtront ici après votre première commande."}</p></div> : <div>{filtered.map((doc) => <div className="document-row" key={doc.ref}><div className="document-main"><span className="document-icon"><FileText size={16} /></span><span><strong>{doc.name}</strong><span>{doc.ref}</span></span></div><span className="document-cell">{doc.date}</span><span className="document-cell">{doc.type}</span><span><StatusBadge status={doc.status === "Disponible" ? "success" : "warning"}>{doc.status}</StatusBadge></span><button className="document-action" onClick={() => notify(doc.status === "Disponible" ? `${doc.name} téléchargée.` : "Ce document sera disponible après validation.")}><Download size={14} style={{ verticalAlign: "-3px", marginRight: 5 }} /> Télécharger</button></div>)}</div>}
      </section>
    </div>
  );
}
