import SiteHeader from "@/components/SiteHeader";
import type { ReactNode } from "react";

export default function PageFrame({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="container-warm py-8">
        <div className="mb-7"><h1 className="text-3xl font-black">{title}</h1>{subtitle && <p className="mt-2 text-sm text-zinc-400">{subtitle}</p>}</div>
        {children}
      </main>
    </div>
  );
}
