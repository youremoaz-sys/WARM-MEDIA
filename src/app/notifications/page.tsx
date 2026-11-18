/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect,useState } from "react";
import PageFrame from "@/components/PageFrame";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
export default function NotificationsPage(){
 const [items,setItems]=useState<any[]>([]);
 useEffect(()=>{const s=createSupabaseBrowser();if(!s)return;s.auth.getUser().then(({data})=>{if(!data.user)return;s.from("notifications").select("*").eq("user_id",data.user.id).order("created_at",{ascending:false}).then(({data})=>setItems(data||[]));s.channel("notifications-live").on("postgres_changes",{event:"INSERT",schema:"public",table:"notifications"},p=>setItems(v=>[p.new,...v])).subscribe();});},[]);
 async function readAll(){const s=createSupabaseBrowser();if(s)await s.from("notifications").update({is_read:true}).neq("is_read",true);setItems(v=>v.map(x=>({...x,is_read:true})));}
 return <PageFrame title="الإشعارات" subtitle="آخر التنبيهات والتحديثات"><button onClick={readAll} className="mb-5 rounded-xl bg-white/5 px-4 py-2 text-sm">تحديد الكل كمقروء</button><div className="grid gap-3">{items.length?items.map(n=><article key={n.id} className={`glass rounded-2xl p-5 ${n.is_read?"opacity-60":"border-[#ed1728]/30"}`}><h2 className="font-bold">{n.title}</h2>{n.body&&<p className="mt-2 text-sm text-zinc-400">{n.body}</p>}</article>):<div className="glass rounded-2xl p-8 text-center text-zinc-400">لا توجد إشعارات جديدة.</div>}</div></PageFrame>;
}
