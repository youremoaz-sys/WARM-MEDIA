/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */
"use client";
import { useEffect,useState } from "react";
import Link from "next/link";
import PageFrame from "@/components/PageFrame";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

export default function ProfilePage(){
 const [profile,setProfile]=useState<any>(null);const [loading,setLoading]=useState(true);
 useEffect(()=>{const s=createSupabaseBrowser();if(!s){setLoading(false);return;}s.auth.getUser().then(async({data})=>{if(!data.user){setLoading(false);return;}const {data:p}=await s.from("profiles").select("*").eq("id",data.user.id).maybeSingle();setProfile(p);setLoading(false);});},[]);
 return <PageFrame title="الملف الشخصي" subtitle="إدارة هويتك وبيانات حسابك">{loading?<div className="glass rounded-2xl p-8 text-zinc-400">جارٍ تحميل الحساب...</div>:!profile?<div className="glass rounded-2xl p-8"><h2 className="font-bold">لم يتم تسجيل الدخول</h2><Link href="/login" className="mt-4 inline-block rounded-xl red-gradient px-5 py-3">تسجيل الدخول</Link></div>:<div className="glass max-w-2xl rounded-2xl p-6"><div className="flex items-center gap-4"><div className="grid h-16 w-16 place-items-center rounded-full bg-[#ed1728]/20 text-2xl font-black">W</div><div><h2 className="text-xl font-bold">{profile.display_name||"مشارك Warm"} {profile.is_verified&&<span className="text-[#4da3ff]" title="موثق">✓</span>}</h2><p className="text-sm text-zinc-500">{profile.account_type==="member"?"مستخدم":profile.account_type}</p></div></div><div className="mt-6 grid gap-3 sm:grid-cols-2"><Link href="/saved" className="rounded-xl bg-white/5 p-4">الأخبار المحفوظة</Link><Link href="/notifications" className="rounded-xl bg-white/5 p-4">الإشعارات</Link></div></div>}</PageFrame>;
}
