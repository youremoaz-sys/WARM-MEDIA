/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {useEffect,useState} from "react";
import PageFrame from "@/components/PageFrame";
import {createSupabaseBrowser} from "@/lib/supabase-browser";
export default function ReportsPage(){const[reports,setReports]=useState<any[]>([]);useEffect(()=>{const s=createSupabaseBrowser();if(s)s.from("user_reports").select("*").order("created_at",{ascending:false}).then(({data})=>setReports(data||[]));},[]);return <PageFrame title="البلاغات والسجلات" subtitle="مراجعة المحتوى والمستخدمين المخالفين"><div className="grid gap-3">{reports.length?reports.map(r=><article key={r.id} className="glass rounded-2xl p-5"><b>{r.reason}</b><p className="mt-2 text-sm text-zinc-400">{r.status}</p></article>):<div className="glass rounded-2xl p-8 text-center text-zinc-400">لا توجد بلاغات قيد المراجعة.</div>}</div></PageFrame>}
