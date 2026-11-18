"use client";
import { useState } from "react";
import PageFrame from "@/components/PageFrame";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

export default function SupportPage(){
 const [category,setCategory]=useState("مساعدة في الحساب");const [subject,setSubject]=useState("");const [body,setBody]=useState("");const [sent,setSent]=useState("");
 async function submit(e:React.FormEvent){e.preventDefault();const s=createSupabaseBrowser();if(!s){setSent("يرجى إعداد Supabase أولًا.");return;}const {data:{user}}=await s.auth.getUser();if(!user){setSent("سجّل الدخول لإرسال طلب دعم.");return;}const ticketNumber=`WM-${Date.now().toString().slice(-8)}`;const {error}=await s.from("support_tickets").insert({ticket_number:ticketNumber,user_id:user.id,category,subject,body});setSent(error?error.message:`تم إرسال الطلب رقم ${ticketNumber}`);if(!error){setSubject("");setBody("");}}
 return <PageFrame title="تواصل مع إدارة Warm Media" subtitle="إرسال مشكلة أو بلاغ أو اقتراح"><form onSubmit={submit} className="glass mx-auto max-w-2xl rounded-2xl p-6"><div className="grid gap-4"><select value={category} onChange={e=>setCategory(e.target.value)} className="rounded-xl border border-white/10 bg-[#101522] px-4 py-3"><option>مساعدة في الحساب</option><option>إبلاغ عن مشكلة تقنية</option><option>إبلاغ عن محتوى</option><option>إبلاغ عن مستخدم</option><option>اقتراح</option></select><input value={subject} onChange={e=>setSubject(e.target.value)} required placeholder="عنوان الطلب" className="rounded-xl border border-white/10 bg-black/20 px-4 py-3"/><textarea value={body} onChange={e=>setBody(e.target.value)} required rows={6} placeholder="اكتب تفاصيل طلبك..." className="rounded-xl border border-white/10 bg-black/20 px-4 py-3"/>{sent&&<p className="text-sm text-zinc-300">{sent}</p>}<button className="rounded-xl red-gradient py-3 font-bold">إرسال الطلب</button></div></form></PageFrame>;
}
