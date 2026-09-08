"use client";
import { ProductThumbnail, ProductMediaPreview } from "./ProductThumbnail";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Filter, Heart, Search, ShoppingBasket, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthProvider";
import { products, useConnect } from "./ConnectProvider";
import { Button, Eyebrow, QuantitySelector, StatusBadge } from "./ui";

export function CommanderPage({ favoritesOnly = false }: { favoritesOnly?: boolean }) {
  const router = useRouter();
  const { account, updateFavorites, createOrder } = useAuth();
  const { cart, addToCart, updateQuantity, clearCart, notify } = useConnect();
  const [query, setQuery] = useState("");
  const [stockFilter, setStockFilter] = useState("Toutes les disponibilités");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [reviewOpen, setReviewOpen] = useState(false);

  useEffect(() => { if (account) setFavorites(new Set(account.favoriteIds)); }, [account]);

  const filteredProducts = useMemo(() => products.filter((product) => {
    const matchesQuery = `${product.name} ${product.lab} ${product.reference}`.toLowerCase().includes(query.toLowerCase());
    const matchesStock = stockFilter === "Toutes les disponibilités" || product.stock === stockFilter;
    const matchesFavorite = !favoritesOnly || favorites.has(product.id);
    return matchesQuery && matchesStock && matchesFavorite;
  }), [favorites, favoritesOnly, query, stockFilter]);
  const cartCount = cart.reduce((total, line) => total + line.quantity, 0);
  const total = cart.reduce((sum, line) => sum + line.price * line.quantity, 0);

  function toggleFavorite(id: string) {
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id); else next.add(id);
      updateFavorites([...next]);
      return next;
    });
  }

  function quantityFor(id: string) { return cart.find((line) => line.id === id)?.quantity ?? 0; }

  function confirmOrder() {
    const created = createOrder(cart);
    setReviewOpen(false);
    clearCart();
    if (created) router.push(`/connect/commandes/${created.toLowerCase()}`);
    else notify("Ajoutez au moins une référence avant de confirmer.");
  }

  return (
    <div className="app-content">
      <div className="app-page-header"><div><span className="app-page-kicker">CATALOGUE / DISPONIBILITÉ EN TEMPS RÉEL</span><h1 className="app-page-title">{favoritesOnly ? "Vos produits favoris." : "Commander sans détour."}</h1><p className="app-page-description">{favoritesOnly ? "Les références que vous retrouvez le plus souvent, prêtes à rejoindre votre prochaine commande." : "Recherchez par nom, laboratoire ou référence. Ajustez vos quantités et construisez votre commande au fil de votre recherche."}</p></div><div className="app-header-action"><StatusBadge status="success">Stock synchronisé</StatusBadge></div></div>
      <p className="product-media-note">Catalogue de démonstration · emballages illustratifs, non contractuels. Cliquez sur un visuel pour consulter la référence.</p><section className="table-card">
        <div className="table-toolbar"><div><Eyebrow>{favoritesOnly ? `FAVORIS / ${String(account?.favoriteIds.length ?? 0).padStart(2, "0")} RÉFÉRENCES` : "CATALOGUE / 08 RÉFÉRENCES"}</Eyebrow></div><div className="table-toolbar-actions"><label className="search-box"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher une référence…" aria-label="Rechercher une référence" /></label><select className="filter-select" value={stockFilter} onChange={(event) => setStockFilter(event.target.value)} aria-label="Filtrer par disponibilité"><option>Toutes les disponibilités</option><option>Disponible</option><option>Stock limité</option><option>Indisponible</option></select><button className="icon-btn" aria-label="Filtres avancés" onClick={() => notify("Les filtres avancés seront disponibles dans la prochaine version.")}><Filter size={15} /></button></div></div>
        {filteredProducts.length === 0 ? <div className="empty-state"><Heart size={28} /><h3>{favoritesOnly ? "Aucun favori pour le moment" : "Aucune référence trouvée"}</h3><p>{favoritesOnly ? "Ajoutez une référence depuis le catalogue pour la retrouver ici." : "Essayez un autre nom, laboratoire ou filtre de disponibilité."}</p></div> : <table className="product-table catalog-table"><thead><tr><th>Produit</th><th>Référence</th><th>Disponibilité</th><th>Quantité</th><th /></tr></thead><tbody>{filteredProducts.map((product) => { const quantity = quantityFor(product.id); return <motion.tr key={product.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}><td><div className="product-name-cell"><ProductMediaPreview product={product} /><span><strong>{product.name}</strong><span>{product.lab}</span><span className="product-inline-reference">{product.reference}</span></span></div></td><td><span className="table-ref">{product.reference}</span></td><td><span className={`stock-label ${product.stock === "Disponible" ? "stock-available" : product.stock === "Stock limité" ? "stock-limited" : "stock-unavailable"}`}>{product.stock}</span></td><td>{quantity > 0 ? <QuantitySelector value={quantity} onDecrease={() => updateQuantity(product.id, quantity - 1)} onIncrease={() => updateQuantity(product.id, quantity + 1)} /> : <Button small variant="quiet" onClick={() => addToCart(product)} disabled={product.stock === "Indisponible"}><ShoppingBasket size={13} /> Ajouter</Button>}</td><td><div className="row-actions"><button className={`favorites-toggle ${favorites.has(product.id) ? "is-favorite" : ""}`} aria-label={favorites.has(product.id) ? `Retirer ${product.name} des favoris` : `Ajouter ${product.name} aux favoris`} onClick={() => toggleFavorite(product.id)}><Heart size={15} fill={favorites.has(product.id) ? "currentColor" : "none"} /></button></div></td></motion.tr>})}</tbody></table>}
      </section>
      <AnimatePresence>{cartCount > 0 && <motion.div className="cart-bar" data-cursor="OUVRIR" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 18 }}><ShoppingBasket size={18} color="var(--sage)" /><div><strong>{cartCount} référence{cartCount > 1 ? "s" : ""} dans la commande</strong><span>Total indicatif · {total.toFixed(2).replace(".", ",")} DH HT</span></div><button className="btn" onClick={() => setReviewOpen(true)}>Voir le récapitulatif</button></motion.div>}</AnimatePresence>
      <AnimatePresence>{reviewOpen && <motion.div className="modal-scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) setReviewOpen(false); }}><motion.div className="modal" initial={{ opacity: 0, y: 18, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: .98 }}><div className="modal-header"><div><Eyebrow>ÉTAPE 01 / RÉCAPITULATIF</Eyebrow><h2>Votre prochaine commande.</h2><p>Vérifiez les références avant de la transmettre à SOREMED.</p></div><button className="icon-btn" onClick={() => setReviewOpen(false)} aria-label="Fermer"><X size={16} /></button></div><div className="modal-body">{cart.map((line) => <div className="modal-item" key={line.id}><span className="product-line-identity"><ProductThumbnail product={line} /><span><strong>{line.name}</strong><span>{line.quantity} × {line.price.toFixed(2).replace(".", ",")} DH · {line.lab}</span></span></span><strong>{(line.price * line.quantity).toFixed(2).replace(".", ",")} DH</strong></div>)}<div className="modal-total"><span>Total indicatif HT</span><strong>{total.toFixed(2).replace(".", ",")} DH</strong></div></div><div className="modal-footer"><Button variant="secondary" onClick={() => setReviewOpen(false)}>Continuer mes achats</Button><Button onClick={confirmOrder}>Confirmer la commande <Check size={14} /></Button></div></motion.div></motion.div>}</AnimatePresence>
    </div>
  );
}
