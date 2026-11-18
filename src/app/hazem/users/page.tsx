/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {useEffect,useState} from "react";
import PageFrame from "@/components/PageFrame";
import {createSupabaseBrowser} from "@/lib/supabase-browser";
export default function AdminUsersPage(){const[users,setUsers]=useState<any[]>([]);useEffect(()=>{const s=createSupabaseBrowser();if(s)s.from("profiles").select("id,display_name,account_type,is_verified,is_blocked,created_at").order("created_at",{ascending:false}).then(({data})=>setUsers(data||[]));},[]);async function toggle(u:any){const s=createSupabaseBrowser();if(s){await s.from("profiles").update({is_blocked:!u.is_blocked}).eq("id",u.id);setUsers(v=>v.map(x=>x.id===u.id?{...x,is_blocked:!u.is_blocked}:x));}}
return <PageFrame title="إدارة المستخدمين" subtitle="حظر وفك الحظر والتوثيق الإداري"><div className="grid gap-3">{users.length?users.map(u=><div key={u.id} className="glass flex items-center justify-between rounded-2xl p-4"><div><b>{u.display_name}</b><p className="text-xs text-zinc-500">{u.account_type}</p></div><button onClick={()=>toggle(u)} className={`rounded-xl px-4 py-2 text-sm ${u.is_blocked?"bg-emerald-600":"bg-[#ed1728]"}`}>{u.is_blocked?"فك الحظر":"حظر"}</button></div>):<div className="glass rounded-2xl p-8 text-center text-zinc-400">لا توجد بيانات مستخدمين متاحة حتى الربط بـ Supabase.</div>}</div></PageFrame>}
