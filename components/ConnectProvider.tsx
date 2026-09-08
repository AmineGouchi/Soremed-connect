"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { ProductMediaAsset } from "./ProductThumbnail";

export type Product = {
  id: string;
  name: string;
  lab: string;
  reference: string;
  price: number;
  stock: "Disponible" | "Stock limité" | "Indisponible";
  favorite?: boolean;
  initials: string;
  media?: ProductMediaAsset;
};

export type CartLine = Product & { quantity: number };

export const products: Product[] = [
  { id: "dol-1000", name: "Doliprane 1000 mg", lab: "Opella Healthcare", reference: "OPL-00184", price: 24.5, stock: "Disponible", favorite: true, initials: "D1" },
  { id: "amx-1g", name: "Amoxicilline 1 g", lab: "Bayer Maroc", reference: "BYR-08412", price: 38.9, stock: "Stock limité", favorite: true, initials: "AM" },
  { id: "spas-80", name: "Spasfon 80 mg", lab: "Teva Santé", reference: "TVA-03510", price: 31.2, stock: "Disponible", initials: "SP" },
  { id: "vent-100", name: "Ventoline 100 µg", lab: "GSK Pharma", reference: "GSK-22049", price: 45.0, stock: "Disponible", favorite: true, initials: "VE" },
  { id: "effer-500", name: "Efferalgan 500 mg", lab: "UPSA Maroc", reference: "UPS-61504", price: 28.75, stock: "Indisponible", initials: "EF" },
  { id: "kard-5", name: "Kardegic 75 mg", lab: "Sanofi", reference: "SNO-72156", price: 42.3, stock: "Disponible", initials: "KA" },
  { id: "maalox", name: "Maalox Suspension", lab: "Johnson & Johnson", reference: "JNJ-00472", price: 36.8, stock: "Stock limité", initials: "MA" },
  { id: "biseptine", name: "Biseptine 125 ml", lab: "Bayer Maroc", reference: "BYR-11203", price: 29.9, stock: "Disponible", initials: "BI" },
];

type Store = {
  cart: CartLine[];
  addToCart: (product: Product) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  toast: string | null;
  notify: (message: string) => void;
};

const ConnectContext = createContext<Store | null>(null);

export function ConnectProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2800);
  }

  function addToCart(product: Product) {
    if (product.stock === "Indisponible") {
      notify("Ce produit est momentanément indisponible.");
      return;
    }
    setCart((current) => {
      const line = current.find((item) => item.id === product.id);
      if (line) return current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...current, { ...product, quantity: 1 }];
    });
    notify(`${product.name} ajouté à la commande.`);
  }

  function updateQuantity(id: string, quantity: number) {
    setCart((current) => quantity <= 0 ? current.filter((item) => item.id !== id) : current.map((item) => item.id === id ? { ...item, quantity } : item));
  }

  const value = useMemo(() => ({
    cart,
    addToCart,
    updateQuantity,
    removeFromCart: (id: string) => updateQuantity(id, 0),
    clearCart: () => setCart([]),
    toast,
    notify,
  }), [cart, toast]);

  return <ConnectContext.Provider value={value}>{children}</ConnectContext.Provider>;
}

export function useConnect() {
  const context = useContext(ConnectContext);
  if (!context) throw new Error("useConnect doit être utilisé dans ConnectProvider");
  return context;
}
