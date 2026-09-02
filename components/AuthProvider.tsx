"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type OrderTone = "info" | "success" | "warning";

export type AccountOrder = {
  id: string;
  date: string;
  items: string;
  total: string;
  status: string;
  tone: OrderTone;
  delivery: string;
  address: string;
  stage: number;
};

export type AccountDocument = {
  name: string;
  ref: string;
  date: string;
  type: string;
  status: "Disponible" | "En préparation";
};

export type AccountActivity = {
  title: string;
  meta: string;
  time: string;
};

export type AccountRecord = {
  id: string;
  email: string;
  password: string;
  responsible: string;
  pharmacy: string;
  phone: string;
  city: string;
  role: "demo" | "customer";
  orders: AccountOrder[];
  documents: AccountDocument[];
  favoriteIds: string[];
  activity: AccountActivity[];
};

type RegistrationInput = Pick<AccountRecord, "responsible" | "pharmacy" | "email" | "phone" | "password"> & { city?: string };

type AuthStore = {
  account: AccountRecord | null;
  hydrated: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  loginDemo: () => void;
  register: (input: RegistrationInput) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  createOrder: (lines: Array<{ name: string; lab: string; price: number; quantity: number }>) => string | null;
  updateFavorites: (favoriteIds: string[]) => void;
};

const STORAGE_KEY = "soremed-connect-auth-v3";

const demoAccount: AccountRecord = {
  id: "demo",
  email: "demo@soremed.ma",
  password: "soremed2026",
  responsible: "Dr. Amine Berrada",
  pharmacy: "Pharmacie Al Amal",
  phone: "+212 5 22 00 00 00",
  city: "Casablanca",
  role: "demo",
  favoriteIds: ["dol-1000", "amx-1g", "vent-100"],
  orders: [
    { id: "SRM-24891", date: "18 juin 2026", items: "8 références", total: "1 248,60 DH", status: "En préparation", tone: "info", delivery: "19 juin, matin", address: "18 rue Ibn Sina", stage: 1 },
    { id: "SRM-24871", date: "16 juin 2026", items: "12 références", total: "2 840,20 DH", status: "Livrée", tone: "success", delivery: "Livrée le 17 juin", address: "18 rue Ibn Sina", stage: 3 },
    { id: "SRM-24798", date: "11 juin 2026", items: "5 références", total: "678,40 DH", status: "Livrée", tone: "success", delivery: "Livrée le 12 juin", address: "18 rue Ibn Sina", stage: 3 },
    { id: "SRM-24751", date: "06 juin 2026", items: "18 références", total: "4 310,00 DH", status: "Livrée", tone: "success", delivery: "Livrée le 07 juin", address: "18 rue Ibn Sina", stage: 3 },
  ],
  documents: [
    { name: "Facture juin 2026", ref: "FAC-10482", date: "18 juin 2026", type: "Factures", status: "Disponible" },
    { name: "Bon de livraison SRM-24871", ref: "BL-24871", date: "17 juin 2026", type: "Bons de livraison", status: "Disponible" },
    { name: "Facture mai 2026", ref: "FAC-10376", date: "31 mai 2026", type: "Factures", status: "Disponible" },
    { name: "Relevé de compte — T2", ref: "REL-2026-T2", date: "30 juin 2026", type: "Relevés", status: "En préparation" },
    { name: "Avoir retour commande", ref: "AV-01034", date: "22 mai 2026", type: "Avoirs", status: "Disponible" },
  ],
  activity: [
    { title: "Commande #SRM-24891 confirmée", meta: "18 juin 2026 · 10:42", time: "Il y a 24 min" },
    { title: "Facture #10482 disponible", meta: "18 juin 2026 · 09:15", time: "Il y a 1 h" },
    { title: "Livraison #SRM-24871 effectuée", meta: "17 juin 2026 · 16:20", time: "Hier" },
  ],
};

const emptyAccount = (input: RegistrationInput, id: string): AccountRecord => ({
  id,
  email: input.email.trim().toLowerCase(),
  password: input.password,
  responsible: input.responsible.trim(),
  pharmacy: input.pharmacy.trim(),
  phone: input.phone.trim(),
  city: input.city?.trim() || "Casablanca",
  role: "customer",
  orders: [],
  documents: [],
  favoriteIds: [],
  activity: [],
});

const AuthContext = createContext<AuthStore | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accounts, setAccounts] = useState<AccountRecord[]>([demoAccount]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const stored = JSON.parse(raw) as { accounts?: AccountRecord[]; currentUserId?: string | null };
        if (Array.isArray(stored.accounts) && stored.accounts.length > 0) setAccounts(stored.accounts);
        if (typeof stored.currentUserId === "string") setCurrentUserId(stored.currentUserId);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ accounts, currentUserId }));
  }, [accounts, currentUserId, hydrated]);

  const account = accounts.find((entry) => entry.id === currentUserId) ?? null;

  async function login(email: string, password: string) {
    await new Promise((resolve) => window.setTimeout(resolve, 420));
    const normalizedEmail = email.trim().toLowerCase();
    const match = accounts.find((entry) => entry.email === normalizedEmail && entry.password === password);
    if (!match) return { ok: false, error: "Email ou mot de passe incorrect." };
    setCurrentUserId(match.id);
    return { ok: true };
  }

  function loginDemo() {
    setCurrentUserId("demo");
  }

  async function register(input: RegistrationInput) {
    await new Promise((resolve) => window.setTimeout(resolve, 520));
    const normalizedEmail = input.email.trim().toLowerCase();
    if (accounts.some((entry) => entry.email === normalizedEmail)) return { ok: false, error: "Un compte existe déjà avec cet email." };
    const next = emptyAccount({ ...input, email: normalizedEmail }, `user-${Date.now()}`);
    setAccounts((current) => [...current, next]);
    setCurrentUserId(null);
    return { ok: true };
  }

  function logout() {
    setCurrentUserId(null);
  }

  function createOrder(lines: Array<{ name: string; lab: string; price: number; quantity: number }>) {
    if (!account || lines.length === 0) return null;
    const id = `SRM-${String(Date.now()).slice(-6)}`;
    const total = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
    const order: AccountOrder = {
      id,
      date: "29 août 2026",
      items: `${lines.reduce((sum, line) => sum + line.quantity, 0)} références`,
      total: `${total.toFixed(2).replace(".", ",")} DH`,
      status: "En préparation",
      tone: "info",
      delivery: "Sous 24 h",
      address: "Votre adresse de livraison",
      stage: 1,
    };
    setAccounts((current) => current.map((entry) => entry.id === account.id ? {
      ...entry,
      orders: [order, ...entry.orders],
      activity: [{ title: `Commande #${id} transmise`, meta: "29 août 2026 · à l’instant", time: "À l’instant" }, ...entry.activity],
    } : entry));
    return id;
  }

  function updateFavorites(favoriteIds: string[]) {
    if (!account) return;
    setAccounts((current) => current.map((entry) => entry.id === account.id ? { ...entry, favoriteIds } : entry));
  }

  const value = useMemo<AuthStore>(() => ({ account, hydrated, login, loginDemo, register, logout, createOrder, updateFavorites }), [account, hydrated, accounts]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth doit être utilisé dans AuthProvider");
  return context;
}
