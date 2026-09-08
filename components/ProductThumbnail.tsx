"use client";

import { useRef, useState } from "react";
import { X } from "lucide-react";
import type { Product } from "./ConnectProvider";
import styles from "./ProductThumbnail.module.css";

/** Only reviewed, locally hosted assets should be added to catalog data. */
export type ProductMediaAsset = {
  src: `/${string}`;
  alt: string;
  sourceUrl: string;
  usageRights: string;
  reviewedAt: string;
};

function PackFallback() {
  return <svg viewBox="0 0 80 80" fill="none" aria-hidden="true"><path d="m17 23 35-6 12 9v36l-35 6-12-9Z" fill="var(--paper)" stroke="var(--line-strong)" /><path d="m17 23 12 9 35-6M29 32v36" stroke="var(--line-strong)"/><path d="m17 39 12 9 35-6v9l-35 6-12-9Z" fill="var(--sage)"/><path d="m36 37 19-3m-19 5 12-2" stroke="var(--green-deep)" strokeWidth="1.5"/><path d="m37 59 11-2" stroke="var(--line-strong)"/></svg>;
}

function Media({ name, asset, large }: { name: string; asset?: ProductMediaAsset; large: boolean }) {
  const usable = asset && asset.src.startsWith("/") && !asset.src.startsWith("//") && asset.sourceUrl && asset.usageRights && asset.reviewedAt;
  const [state, setState] = useState<"loading" | "loaded" | "fallback">(usable ? "loading" : "fallback");
  return <span className={`${styles.media} ${large ? styles.large : ""}`} data-state={state} aria-busy={state === "loading"} role={state === "fallback" ? "img" : undefined} aria-label={state === "fallback" ? `Emballage illustratif, visuel officiel non disponible : ${name}` : undefined}>
    {state !== "loaded" && <PackFallback />}
    {usable && state !== "fallback" && <img src={asset.src} alt={asset.alt || name} width="240" height="240" loading={large ? "eager" : "lazy"} decoding="async" onLoad={() => setState("loaded")} onError={() => setState("fallback")} />}
  </span>;
}

export function ProductThumbnail({ product, large = false }: { product: Pick<Product, "name" | "media">; large?: boolean }) {
  return <Media key={product.media?.src ?? "fallback"} name={product.name} asset={product.media} large={large} />;
}

export function ProductMediaPreview({ product }: { product: Product }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  return <><button ref={trigger} type="button" className={styles.trigger} aria-label={`Voir la fiche de ${product.name}`} onClick={() => dialog.current?.showModal()}><ProductThumbnail product={product} /></button>
    <dialog ref={dialog} className={styles.dialog} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }} onClose={() => trigger.current?.focus()} aria-label={`Fiche de ${product.name}`}>
      <button type="button" className={styles.close} aria-label="Fermer la fiche produit" onClick={() => dialog.current?.close()}><X size={20} /></button>
      <ProductThumbnail product={product} large /><p className={styles.note}>Catalogue de démonstration · visuel non contractuel</p>
      <h2>{product.name}</h2><p>{product.lab}</p><dl><div><dt>Référence</dt><dd>{product.reference}</dd></div><div><dt>Disponibilité démo</dt><dd>{product.stock}</dd></div></dl>
      <p className={styles.note}>Identifiez le produit par son libellé et sa référence, jamais par l’illustration seule.</p>
    </dialog></>;
}
