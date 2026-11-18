/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import PageFrame from "@/components/PageFrame";
import { Search } from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
export default function SearchPage(){
 const [q,setQ]=useState("");const [results,setResults]=useState<any[]>([]);const [loading,setLoading]=useState(false);
 async function search(){if(!q.trim())return;setLoading(true);const s=createSupabaseBrowser();if(s){const {data}=await s.from("posts").select("id,title,slug,excerpt").eq("status","published").or(`title.ilike.%${q}% ,excerpt.ilike.%${q}%`).limit(30);setResults(data||[]);}setLoading(false);}
 return <PageFrame title="البحث" subtitle="ابحث في أخبار ومقالات Warm Media"><div className="mx-auto max-w-2xl"><div className="flex gap-2"><input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")search();}} placeholder="اكتب كلمات البحث..." className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/20 px-4 py-3"/><button onClick={search} className="grid h-12 w-12 place-items-center rounded-xl red-gradient"><Search size={18}/></button></div><div className="mt-5 grid gap-3">{loading?<div className="glass rounded-2xl p-8 text-center text-zinc-400">جارٍ البحث...</div>:results.length?results.map(r=><a key={r.id} href={`/news/${r.slug}`} className="glass rounded-2xl p-5"><b>{r.title}</b><p className="mt-2 text-sm text-zinc-400">{r.excerpt}</p></a>):<div className="glass rounded-2xl p-8 text-center text-zinc-400">{q?"لا توجد نتائج مطابقة.":"ابدأ بكتابة كلمة للبحث."}</div>}</div></div></PageFrame>
}
