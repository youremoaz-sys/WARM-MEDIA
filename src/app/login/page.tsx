"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Brand } from "@/components/SiteHeader";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

export default function LoginPage(){
 const router=useRouter();
 const [phone,setPhone]=useState(""); const [password,setPassword]=useState(""); const [error,setError]=useState(""); const [loading,setLoading]=useState(false);
 async function login(e:React.FormEvent){e.preventDefault();setLoading(true);setError("");const s=createSupabaseBrowser();if(!s){setError("أضف مفاتيح Supabase في ملف .env.local.");setLoading(false);return;}const {error}=await s.auth.signInWithPassword({phone,password});if(error)setError(error.message);else router.push("/profile");setLoading(false);}
 return <main className="grid min-h-screen place-items-center px-4"><div className="glass w-full max-w-md rounded-3xl p-6 md:p-8"><Brand/><h1 className="mt-8 text-2xl font-black">تسجيل الدخول</h1><form onSubmit={login} className="mt-6 grid gap-4"><label className="text-sm text-zinc-400">رقم الهاتف<input dir="ltr" value={phone} onChange={e=>setPhone(e.target.value)} required pattern="[+][0-9]{10,15}" placeholder="+201000000000" className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-[#ed1728]"/></label><label className="text-sm text-zinc-400">كلمة المرور<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-[#ed1728]"/></label>{error&&<p className="rounded-xl bg-[#ed1728]/10 p-3 text-sm text-[#ff6875]">{error}</p>}<button disabled={loading} className="rounded-xl red-gradient py-3 font-bold disabled:opacity-50">{loading?"جارٍ الدخول...":"دخول"}</button></form><div className="mt-5 flex justify-between text-sm text-zinc-400"><Link href="/signup" className="text-white">إنشاء حساب</Link><Link href="/support">الدعم والمساعدة</Link></div></div></main>;
}
