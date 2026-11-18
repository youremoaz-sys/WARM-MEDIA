"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Bell, Menu, Search, UserRound, X, Palette } from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { useWarmTheme } from "@/components/ThemeProvider";

export function Brand() {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label="Warm Media">
      <span className="grid h-10 w-10 place-items-center rounded-xl red-gradient text-xl font-black">W</span>
      <span><b className="brand-3d block text-lg leading-none">WARM MEDIA</b><small className="text-[10px] tracking-[0.18em] text-zinc-400">YOUR NEWS. ALWAYS WARM.</small></span>
    </Link>
  );
}

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const supabase = createSupabaseBrowser();
  const {theme,setTheme}=useWarmTheme();
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSignedIn(Boolean(data.session)));
  }, [supabase]);
  const nav = [["الرئيسية","/"],["الأخبار","/news"],["عاجل","/breaking"],["المجتمع","/community"],["المقالات","/articles"],["الدعم","/support"]] as const;
  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[#080a10]/90 backdrop-blur-xl">
      <div className="container-warm flex h-[72px] items-center justify-between">
        <Brand />
        <nav className="hidden items-center gap-6 lg:flex">{nav.map(([label,href]) => <Link key={href} href={href} className="text-sm text-zinc-300 transition hover:text-white">{label}</Link>)}</nav>
        <div className="flex items-center gap-2">
          <button onClick={()=>setTheme(theme==="dark"?"light":theme==="light"?"red":"dark")} className="grid h-10 w-10 place-items-center rounded-full bg-white/5" aria-label={`تغيير المظهر، الحالي ${theme}`}>
            <Palette size={18}/>
          </button>
          <Link href="/search" className="grid h-10 w-10 place-items-center rounded-full bg-white/5" aria-label="بحث"><Search size={18}/></Link>
          {signedIn && <Link href="/notifications" className="grid h-10 w-10 place-items-center rounded-full bg-white/5" aria-label="الإشعارات"><Bell size={18}/></Link>}
          <Link href={signedIn ? "/profile" : "/login"} className="flex h-10 items-center gap-2 rounded-full border border-white/10 px-3 text-sm"><UserRound size={17}/><span className="hidden sm:inline">{signedIn ? "حسابي" : "دخول"}</span></Link>
          <button onClick={() => setOpen(!open)} className="grid h-10 w-10 place-items-center rounded-full bg-white/5 lg:hidden" aria-label="القائمة">{open ? <X size={20}/> : <Menu size={20}/>}</button>
        </div>
      </div>
      {open && (
        <div className="menu-shell lg:hidden" onMouseDown={e=>{if(e.target===e.currentTarget)setOpen(false)}} role="presentation">
          <aside className="menu-panel p-5" aria-label="القائمة الرئيسية">
            <div className="mb-5 flex items-center justify-between"><Brand/><button onClick={()=>setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full bg-white/5" aria-label="إغلاق القائمة"><X size={20}/></button></div>
            <nav className="grid gap-2">{nav.map(([label,href],i)=><Link onClick={()=>setOpen(false)} key={href} href={href} style={{animation:`drawer-in .32s ${i*45}ms both`}} className="rounded-xl px-4 py-3 text-sm hover:bg-white/5">{label}</Link>)}</nav>
          </aside>
        </div>
      )}
    </header>
  );
}
