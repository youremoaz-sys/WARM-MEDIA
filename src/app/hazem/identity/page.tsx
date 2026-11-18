"use client";

import { useEffect, useRef, useState } from "react";
import PageFrame from "@/components/PageFrame";
import { createSupabaseBrowser } from "@/lib/supabase-browser";
import { ImagePlus, Upload } from "lucide-react";

type Brand = { name:string; tagline:string; description:string; footer:string; logo_url?:string; cover_url?:string; favicon_url?:string; social?:{twitter:string;facebook:string;instagram:string}; contact?:string };
const defaults:Brand={name:"Warm Media",tagline:"أخبار بعيون مختلفة",description:"منصة إعلامية واجتماعية عربية",footer:"© 2026 Warm Media",social:{twitter:"",facebook:"",instagram:""},contact:""};

export default function IdentityPage(){
 const [brand,setBrand]=useState<Brand>(defaults);
 const [preview,setPreview]=useState<{[key:string]:string}>({});
 const [message,setMessage]=useState("");
 const [progress,setProgress]=useState(0);
 const fileRefs=useRef<{[key:string]:File}>({});
 useEffect(()=>{const s=createSupabaseBrowser();if(!s)return;s.from("site_settings").select("value").eq("key","brand").maybeSingle().then(({data})=>{if(data?.value)setBrand({...defaults,...data.value,social:{...defaults.social,...(data.value as Brand).social}});});},[]);
 function selectFile(field:keyof Brand,file:File|null){
  if(!file)return;
  if(!["image/png","image/jpeg","image/webp","image/avif","image/svg+xml"].includes(file.type)){setMessage("نوع الملف غير مدعوم.");return;}
  if(file.size>5*1024*1024){setMessage("حجم الصورة يجب ألا يتجاوز 5 ميجابايت.");return;}
  fileRefs.current[field as string]=file;setPreview(v=>({...v,[field]:URL.createObjectURL(file)}));setMessage("");
 }
 async function uploadFile(field:keyof Brand){
  const file=fileRefs.current[field as string];if(!file)return;
  const s=createSupabaseBrowser();if(!s){setMessage("أضف مفاتيح Supabase.");return;}
  setProgress(15);
  const path=`branding/${field}-${crypto.randomUUID()}-${file.name.replace(/\s+/g,"-")}`;
  const {data,error}=await s.storage.from("branding").upload(path,file,{cacheControl:"31536000",upsert:false,contentType:file.type});
  if(error||!data){setMessage(error?.message||"تعذر رفع الصورة.");return;}
  setProgress(80);
  const {data:url}=s.storage.from("branding").getPublicUrl(data.path);
  setBrand(v=>({...v,[field]:url.publicUrl}));
  setProgress(100);setMessage("تم رفع الصورة بنجاح.");
 }
 async function save(){
  const s=createSupabaseBrowser();if(!s){setMessage("أضف مفاتيح Supabase.");return;}
  const {error}=await s.from("site_settings").upsert({key:"brand",value:brand,updated_at:new Date().toISOString()});
  setMessage(error?error.message:"تم حفظ هوية الموقع لجميع المستخدمين.");
 }
 const fields:[keyof Brand,string][]=[["logo_url","شعار الموقع"],["cover_url","صورة الغلاف"],["favicon_url","Favicon"]];
 return <PageFrame title="إدارة هوية الموقع والتصميم" subtitle="تغيير الهوية والصور والنصوص والروابط"><div className="grid gap-5 lg:grid-cols-[1fr_360px]">
  <div className="glass grid gap-4 rounded-2xl p-5"><label className="grid gap-2 text-sm">اسم الموقع<input value={brand.name} onChange={e=>setBrand(v=>({...v,name:e.target.value}))} className="rounded-xl border border-white/10 bg-black/10 px-4 py-3"/></label><label className="grid gap-2 text-sm">العبارة التعريفية<input value={brand.tagline} onChange={e=>setBrand(v=>({...v,tagline:e.target.value}))} className="rounded-xl border border-white/10 bg-black/10 px-4 py-3"/></label><label className="grid gap-2 text-sm">وصف الموقع<textarea value={brand.description} onChange={e=>setBrand(v=>({...v,description:e.target.value}))} rows={3} className="rounded-xl border border-white/10 bg-black/10 px-4 py-3"/></label><label className="grid gap-2 text-sm">محتوى الفوتر<input value={brand.footer} onChange={e=>setBrand(v=>({...v,footer:e.target.value}))} className="rounded-xl border border-white/10 bg-black/10 px-4 py-3"/></label><label className="grid gap-2 text-sm">بيانات التواصل والدعم<input value={brand.contact||""} onChange={e=>setBrand(v=>({...v,contact:e.target.value}))} className="rounded-xl border border-white/10 bg-black/10 px-4 py-3"/></label></div>
  <aside className="glass rounded-2xl p-5"><h2 className="mb-4 font-bold">معاينة الهوية</h2><div className="rounded-2xl bg-[#080a10] p-5 text-center text-white"><div className="brand-3d text-2xl font-black">{brand.name}</div><p className="mt-2 text-xs text-zinc-400">{brand.tagline}</p></div></aside>
  <div className="glass grid gap-4 rounded-2xl p-5 lg:col-span-2"><h2 className="font-bold">الصور والشعار</h2><div className="grid gap-4 md:grid-cols-3">{fields.map(([field,label])=>{const value=preview[field as string]||brand[field as keyof Brand] as string|undefined;return <div key={field} className="rounded-xl border border-white/8 p-3"><p className="mb-3 text-sm">{label}</p><div className="grid h-32 place-items-center overflow-hidden rounded-lg bg-white/5">{value?<img src={value} alt={label} className="h-full w-full object-contain"/>:<ImagePlus className="text-zinc-500"/>}</div><input type="file" accept="image/png,image/jpeg,image/webp,image/avif,image/svg+xml" onChange={e=>selectFile(field,e.target.files?.[0]||null)} className="mt-3 w-full text-xs"/><button onClick={()=>uploadFile(field)} className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-white/8 py-2 text-xs"><Upload size={14}/>رفع واستبدال</button></div>})}</div>{progress>0&&<div className="h-2 overflow-hidden rounded-full bg-white/5"><div className="h-full red-gradient transition-all" style={{width:`${progress}%`}}/></div>} </div>
 </div>{message&&<p className="mt-4 text-sm">{message}</p>}<button onClick={save} className="mt-5 rounded-xl red-gradient px-6 py-3 font-bold">حفظ الهوية والتصميم</button></PageFrame>;
}
