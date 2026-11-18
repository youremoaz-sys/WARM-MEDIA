/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {useEffect,useState} from "react";
import PageFrame from "@/components/PageFrame";
import {createSupabaseBrowser} from "@/lib/supabase-browser";
export default function AdminSupportPage(){const[tickets,setTickets]=useState<any[]>([]);useEffect(()=>{const s=createSupabaseBrowser();if(s)s.from("support_tickets").select("*").order("created_at",{ascending:false}).then(({data})=>setTickets(data||[]));},[]);return <PageFrame title="إدارة الدعم الفني" subtitle="طلبات المستخدمين وحالاتها"><div className="grid gap-3">{tickets.length?tickets.map(t=><article key={t.id} className="glass rounded-2xl p-5"><div className="flex justify-between"><b>{t.subject}</b><span className="text-xs text-zinc-400">{t.status}</span></div><p className="mt-2 text-sm text-zinc-400">{t.body}</p><p className="mt-3 text-xs text-zinc-500">{t.ticket_number}</p></article>):<div className="glass rounded-2xl p-8 text-center text-zinc-400">لا توجد طلبات دعم حاليًا.</div>}</div></PageFrame>}
