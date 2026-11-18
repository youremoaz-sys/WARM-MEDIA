"use client";
import {useState} from "react";
import PageFrame from "@/components/PageFrame";
import {createSupabaseBrowser} from "@/lib/supabase-browser";
export default function AdminRoomsPage(){const[title,setTitle]=useState("");const[description,setDescription]=useState("");const[msg,setMsg]=useState("");
async function createRoom(e:React.FormEvent){e.preventDefault();const s=createSupabaseBrowser();if(!s){setMsg("أضف مفاتيح Supabase.");return;}const {data:{user}}=await s.auth.getUser();if(!user){setMsg("سجّل دخول الأدمن.");return;}const {error}=await s.from("chat_rooms").insert({title,description,creator_id:user.id,is_open:true});setMsg(error?error.message:"تم إنشاء الغرفة وفتحها.");if(!error){setTitle("");setDescription("");}}
return <PageFrame title="إدارة غرف النقاش" subtitle="فتح وإعادة فتح وإغلاق الغرف"><form onSubmit={createRoom} className="glass grid max-w-2xl gap-4 rounded-2xl p-6"><input value={title} onChange={e=>setTitle(e.target.value)} required placeholder="عنوان النقاش" className="rounded-xl border border-white/10 bg-black/20 px-4 py-3"/><textarea value={description} onChange={e=>setDescription(e.target.value)} rows={4} placeholder="وصف النقاش" className="rounded-xl border border-white/10 bg-black/20 px-4 py-3"/>{msg&&<p className="text-sm">{msg}</p>}<button className="rounded-xl red-gradient py-3 font-bold">إنشاء غرفة نقاش</button></form></PageFrame>}
