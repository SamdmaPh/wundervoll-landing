import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — Wundervoll",
  description: "Dein persönlicher Lernbereich.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
