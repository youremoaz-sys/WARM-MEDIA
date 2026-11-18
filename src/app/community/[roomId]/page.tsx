/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useRef, useState } from "react";
import { Send, Eye, EyeOff, ShieldCheck } from "lucide-react";
import PageFrame from "@/components/PageFrame";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

export default function RoomPage({params}:{params:{roomId:string}}){
 const [room,setRoom]=useState<any>(null);const [messages,setMessages]=useState<any[]>([]);const [body,setBody]=useState("");const [revealed,setRevealed]=useState(false);const [error,setError]=useState("");const bottom=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const s=createSupabaseBrowser();if(!s)return;
  s.from("chat_rooms").select("*").eq("id",params.roomId).maybeSingle().then(({data})=>setRoom(data));
  s.from("chat_messages").select("*,profiles(display_name,is_verified)").eq("room_id",params.roomId).eq("is_deleted",false).order("created_at",{ascending:true}).then(({data})=>setMessages(data||[]));
  const channel=s.channel(`room:${params.roomId}`).on("postgres_changes",{event:"INSERT",schema:"public",table:"chat_messages",filter:`room_id=eq.${params.roomId}`},payload=>setMessages(v=>[...v,payload.new])).subscribe();
  return ()=>{void s.removeChannel(channel)};
 },[params.roomId]);
 useEffect(()=>bottom.current?.scrollIntoView({behavior:"smooth"}),[messages]);
 async function send(e:React.FormEvent){e.preventDefault();setError("");const s=createSupabaseBrowser();if(!s){setError("الاتصال بقاعدة البيانات غير جاهز.");return;}const {data:{user}}=await s.auth.getUser();if(!user){setError("سجّل الدخول لإرسال رسالة.");return;}if(!room?.is_open){setError("الغرفة مغلقة.");return;}const {error}=await s.from("chat_messages").insert({room_id:params.roomId,user_id:user.id,body});if(error)setError(error.message);else setBody("");}
 async function reveal(){setError("");const s=createSupabaseBrowser();if(!s){setError("الاتصال بقاعدة البيانات غير جاهز.");return;}const {data:{user}}=await s.auth.getUser();if(!user){setError("سجّل الدخول أولًا.");return;}const expires=new Date(Date.now()+60*60*1000).toISOString();const {error}=await s.from("user_identity_sessions").insert({user_id:user.id,room_id:params.roomId,expires_at:expires});if(error)setError(error.message);else setRevealed(true);}
 return <PageFrame title={room?.title||"غرفة نقاش"} subtitle={room?.description||"نقاش مباشر"}><div className="glass overflow-hidden rounded-2xl"><div className="flex items-center justify-between border-b border-white/5 p-4"><span className={`rounded-md px-2 py-1 text-xs ${room?.is_open?"bg-emerald-500/15 text-emerald-400":"bg-zinc-500/15 text-zinc-400"}`}>{room?.is_open?"مفتوحة":"مغلقة"}</span><button onClick={reveal} className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-xs">{revealed?<Eye size={15}/>:<EyeOff size={15}/>} {revealed?"هويتك ظاهرة ساعة":"إظهار هويتي لمدة ساعة"}</button></div><div className="h-[430px] overflow-y-auto p-4">{messages.length?messages.map((m,i)=><div key={m.id||i} className="mb-3 flex gap-3"><div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#ed1728]/20 text-xs font-bold">م</div><div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-white/5 px-4 py-3"><div className="mb-1 flex items-center gap-1 text-xs text-zinc-400">{revealed?(m.profiles?.display_name||"مشارك"): "مشارك مجهول"} {revealed&&m.profiles?.is_verified&&<ShieldCheck size={12} className="text-[#4da3ff]"/>}</div><p className="text-sm">{m.body}</p></div></div>):<div className="grid h-full place-items-center text-sm text-zinc-500">لا توجد رسائل بعد. كن أول من يشارك الرأي.</div>}<div ref={bottom}/></div>{error&&<p className="mx-4 mb-2 text-sm text-[#ff6875]">{error}</p>}<form onSubmit={send} className="flex gap-2 border-t border-white/5 p-4"><input value={body} onChange={e=>setBody(e.target.value)} placeholder="اكتب رسالتك..." className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none"/><button className="grid h-12 w-12 place-items-center rounded-xl red-gradient"><Send size={18}/></button></form></div></PageFrame>;
}
