/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect,useState } from "react";
import PageFrame from "@/components/PageFrame";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
export default function SavedPage(){const [items,setItems]=useState<any[]>([]);useEffect(()=>{const s=createSupabaseBrowser();if(s)s.from("saved_posts").select("post_id,posts(title,slug)").then(({data})=>setItems(data||[]));},[]);return <PageFrame title="المفضلة" subtitle="الأخبار المحفوظة"><div className="grid gap-4">{items.length?items.map(i=><article key={i.post_id} className="glass rounded-2xl p-5"><h2 className="font-bold">{i.posts?.title||"خبر محفوظ"}</h2></article>):<div className="glass rounded-2xl p-8 text-center text-zinc-400">لا توجد أخبار محفوظة.</div>}</div></PageFrame>}
