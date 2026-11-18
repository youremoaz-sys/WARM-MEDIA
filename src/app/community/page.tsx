/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import PageFrame from "@/components/PageFrame";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { MessageCircle, Users } from "lucide-react";

export default function CommunityPage() {
 const [rooms,setRooms]=useState<any[]>([]);
 useEffect(()=>{const s=createSupabaseBrowser();if(s)s.from("chat_rooms").select("*").order("created_at",{ascending:false}).then(({data})=>setRooms(data||[]));},[]);
 return <PageFrame title="مجتمع Warm Media" subtitle="نقاشات جماعية حية وإخفاء هوية افتراضي"><div className="grid gap-5 md:grid-cols-2">
 {rooms.length ? rooms.map(r=><Link href={`/community/${r.id}`} key={r.id} className="glass rounded-2xl p-5"><div className="mb-4 flex justify-between"><span className={`rounded-md px-2 py-1 text-xs ${r.is_open?"bg-emerald-500/15 text-emerald-400":"bg-zinc-500/15 text-zinc-400"}`}>{r.is_open?"مفتوحة":"مغلقة"}</span><MessageCircle size={18}/></div><h2 className="text-xl font-bold">{r.title}</h2><p className="mt-2 text-sm text-zinc-400">{r.description||"نقاش مفتوح"}</p><div className="mt-5 flex gap-4 text-xs text-zinc-500"><span className="flex gap-1"><Users size={13}/> مشاركون</span><span className="flex gap-1"><MessageCircle size={13}/> رسائل</span></div></Link>) :
 <div className="col-span-full glass rounded-2xl p-10 text-center"><MessageCircle className="mx-auto text-[#ed1728]" size={32}/><h2 className="mt-3 font-bold">لا توجد غرف نقاش متاحة حاليًا</h2><p className="mt-2 text-sm text-zinc-400">ستظهر الغرف المنشأة من لوحة HAZEM هنا فورًا.</p></div>}
 </div></PageFrame>;
}
