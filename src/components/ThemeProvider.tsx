/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { createSupabaseBrowser } from "@/lib/supabase-browser";

type ThemeName = "dark" | "light" | "red";
type ThemeContextValue = { theme: ThemeName; setTheme: (theme: ThemeName) => void };
const ThemeContext = createContext<ThemeContextValue>({ theme:"dark", setTheme:()=>{} });

const fontLinks: Record<string,string> = {
 Cairo:"Cairo", Tajawal:"Tajawal", "IBM Plex Sans Arabic":"IBM+Plex+Sans+Arabic",
 "Noto Sans Arabic":"Noto+Sans+Arabic", Almarai:"Almarai", Alexandria:"Alexandria",
 Changa:"Changa", "Readex Pro":"Readex+Pro", Rubik:"Rubik", "Somar Sans":"Somar+Sans"
};

export default function ThemeProvider({children}:{children:ReactNode}) {
  const [theme,setThemeState]=useState<ThemeName>("dark");
  const supabase=createSupabaseBrowser();

  useEffect(()=>{
    const saved=localStorage.getItem("warm-theme") as ThemeName|null;
    if(saved==="dark"||saved==="light"||saved==="red"){setThemeState(saved);document.documentElement.dataset.theme=saved;}
    else document.documentElement.dataset.theme="dark";

    const s=createSupabaseBrowser();
    if(!s)return;
    s.auth.getUser().then(async({data})=>{
      if(!data.user)return;
      const {data:profile}=await s.from("profiles").select("theme_preference").eq("id",data.user.id).maybeSingle();
      const preference=(profile as {theme_preference?:ThemeName}|null)?.theme_preference;
      if(preference==="dark"||preference==="light"||preference==="red"){setThemeState(preference);document.documentElement.dataset.theme=preference;localStorage.setItem("warm-theme",preference);}
    });

    s.from("site_settings").select("key,value").in("key",["brand","typography","theme"]).then(({data})=>{
      if(!data)return;
      const values=Object.fromEntries(data.map(row=>[row.key,row.value]));
      const typ=values.typography||{};
      if(typ.font&&fontLinks[typ.font]){
        const id="warm-google-font";
        if(!document.getElementById(id)){const link=document.createElement("link");link.id=id;link.rel="stylesheet";link.href=`https://fonts.googleapis.com/css2?family=${fontLinks[typ.font]}:wght@400;500;600;700;800&display=swap`;document.head.appendChild(link);}
        document.documentElement.style.setProperty("--font-warm",`"${typ.font}","Segoe UI",Tahoma,sans-serif`);
      }
      if(typ.sizes){Object.entries(typ.sizes).forEach(([key,value])=>{const names:Record<string,string>={h1:"--h1-size",h2:"--h2-size",h3:"--h3-size",body:"--body-size"};if(names[key])document.documentElement.style.setProperty(names[key],`${value}px`);});}
      if(typ.colors){Object.entries(typ.colors).forEach(([key,value])=>{const names:Record<string,string>={main:"--warm-text",secondary:"--warm-text-sub",link:"--warm-link",buttonText:"--warm-button-text"};if(names[key])document.documentElement.style.setProperty(names[key],String(value));});}
    });
  },[]);

  function setTheme(next:ThemeName){
    const set=()=>{setThemeState(next);document.documentElement.dataset.theme=next;localStorage.setItem("warm-theme",next);
      if(supabase)supabase.auth.getUser().then(({data})=>{if(data.user)supabase.from("profiles").update({theme_preference:next}).eq("id",data.user.id);});
    };
    set();
    const el=document.createElement("span");el.className="theme-wipe";el.style.left="50%";el.style.top="12%";
    el.style.setProperty("--wipe-color",next==="light"?"#ffffff":next==="red"?"#ed1728":"#080a10");
    document.body.appendChild(el);
    setTimeout(()=>el.remove(),720);
  }
  return <ThemeContext.Provider value={{theme,setTheme}}>{children}</ThemeContext.Provider>;
}
export function useWarmTheme(){return useContext(ThemeContext);}
