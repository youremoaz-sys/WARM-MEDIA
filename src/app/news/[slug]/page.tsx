/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { Bookmark, MessageCircle, Share2, ThumbsUp } from "lucide-react";
import PageFrame from "@/components/PageFrame";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

export default function ArticlePage({params}:{params:{slug:string}}) {
  const [liked,setLiked]=useState(false); const [saved,setSaved]=useState(false); const [message,setMessage]=useState("");
  const [post,setPost]=useState<any>(null);
  const supabase=createSupabaseBrowser();
  useEffect(()=>{const s=createSupabaseBrowser();if(!s)return;s.from("posts").select("*,categories(name_ar)").eq("slug",params.slug).maybeSingle().then(({data})=>setPost(data));},[params.slug]);
  async function shareArticle(){ if(navigator.share) await navigator.share({title:"Warm Media",url:location.href}); else await navigator.clipboard.writeText(location.href); }
   async function addComment(){ if(!message.trim()||!post) return; const s=createSupabaseBrowser(); if(!s) return; const {data:{user}}=await s.auth.getUser(); if(!user) return; await s.from("post_comments").insert({post_id:post.id,user_id:user.id,body:message}); setMessage(""); }
   return <PageFrame title={post?.title||"تفاصيل الخبر"} subtitle="Warm Media News"><article className="mx-auto max-w-4xl"><div className="h-72 rounded-3xl bg-[radial-gradient(circle_at_70%_20%,rgba(237,23,40,.25),transparent_35%),linear-gradient(135deg,#1b2234,#090b12)]"/><div className="py-7"><div className="flex flex-wrap items-center justify-between gap-4"><span className="rounded-md bg-[#ed1728] px-3 py-1 text-xs">{post?.categories?.name_ar||"أخبار وإعلام"}</span><span className="text-xs text-zinc-500">{post?.published_at?new Date(post.published_at).toLocaleString("ar-EG"):"نُشر الآن"} • محرر Warm Media ✓</span></div><h1 className="mt-5 text-3xl font-black leading-tight md:text-5xl">{post?.title||"تفاصيل الخبر"}</h1><p className="mt-5 leading-8 text-zinc-300">{post?.content||"سيظهر محتوى الخبر الكامل بعد ربط الصفحة بقاعدة بيانات Supabase ونشر الخبر من لوحة HAZEM."}</p><div className="mt-7 flex flex-wrap gap-2"><button onClick={()=>setLiked(!liked)} className={`flex items-center gap-2 rounded-xl px-4 py-3 ${liked?"bg-[#ed1728]":"bg-white/5"}`}><ThumbsUp size={18}/>{liked?"تم الإعجاب":"إعجاب"}</button><button onClick={()=>setSaved(!saved)} className={`flex items-center gap-2 rounded-xl px-4 py-3 ${saved?"bg-white/15":"bg-white/5"}`}><Bookmark size={18}/>حفظ</button><button onClick={shareArticle} className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-3"><Share2 size={18}/>مشاركة</button></div></div>
  <section className="glass mt-4 rounded-2xl p-5"><h2 className="mb-4 flex items-center gap-2 font-bold"><MessageCircle size={18}/> التعليقات</h2>{supabase?<div className="flex gap-2"><input value={message} onChange={e=>setMessage(e.target.value)} className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-[#ed1728]" placeholder="أضف تعليقًا..." /><button onClick={addComment} className="rounded-xl red-gradient px-5">نشر</button></div>:<p className="text-sm text-zinc-400">سجل دخولك واربط Supabase لإضافة التعليقات.</p>}</section></article></PageFrame>;
}
