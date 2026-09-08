import type { Metadata } from "next";
import { AuthProvider } from "@/components/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  icons: { icon: "/branding/SOREMED.png", apple: "/branding/SOREMED.png" },
  title: "SOREMED Connect — La distribution pharmaceutique, réinventée",
  description:
    "Le portail B2B de SOREMED pour commander plus vite, suivre chaque livraison et piloter son activité officinale.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <body><AuthProvider>{children}</AuthProvider></body>
    </html>
  );
}
