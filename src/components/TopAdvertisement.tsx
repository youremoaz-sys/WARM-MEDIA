/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

export default function TopAdvertisement() {
  const [ad,setAd]=useState<any>(null);
  useEffect(()=>{
    const s=createSupabaseBrowser();if(!s)return;
    s.from("advertisements").select("*").eq("is_active",true).eq("placement","top").lte("start_at",new Date().toISOString()).or(`end_at.is.null,end_at.gte.${new Date().toISOString()}`).order("created_at",{ascending:false}).limit(1).maybeSingle().then(async({data})=>{
      if(!data)return;
      setAd(data);
      await s.from("ad_impressions").insert({ad_id:data.id,user_id:null});
    });
  },[]);
  if(!ad)return null;
  return (
    <aside className="container-warm mt-3" aria-label="إعلان">
      <div className="flex min-h-[58px] items-center gap-3 rounded-2xl border border-white/8 bg-[var(--warm-panel)] px-3 py-2">
        {ad.image_url&&<img src={ad.image_url} alt="" width={76} height={42} loading="lazy" className="h-[42px] w-[76px] rounded-lg object-cover"/>}
        <a href={ad.destination_url||"#"} target="_blank" rel="noopener noreferrer" onClick={()=>{const s=createSupabaseBrowser();if(s)s.from("ad_clicks").insert({ad_id:ad.id,user_id:null});}} className="min-w-0 flex-1 text-sm">
          <b className="block truncate">{ad.title}</b><span className="text-xs text-[var(--warm-text-sub)]">إعلان</span>
        </a>
        <button onClick={()=>setAd(null)} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-black/10" aria-label="إغلاق الإعلان"><X size={16}/></button>
      </div>
    </aside>
  );
}
