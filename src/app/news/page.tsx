import Link from "next/link";
import PageFrame from "@/components/PageFrame";
import { MessageCircle, Eye, Bookmark } from "lucide-react";

export default function NewsPage() {
  const posts = [
    ["تحليل اقتصادي","قراءات معمقة في التطورات الاقتصادية","اقتصاد","5 دقائق"],
    ["نتائج ومنافسات","أهم ما حدث في الساحة الرياضية","رياضة","12 دقيقة"],
    ["ابتكارات جديدة","مستجدات عالم التكنولوجيا","تكنولوجيا","20 دقيقة"],
  ];
  return <PageFrame title="الأخبار" subtitle="جميع الأخبار والتطورات من مصادر Warm Media"><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{posts.map((p,i)=><Link href={`/news/post-${i+1}`} key={p[0]} className="glass overflow-hidden rounded-2xl"><div className="h-44 bg-[linear-gradient(135deg,#20283a,#0b0d13)] p-5"><span className="rounded bg-[#ed1728] px-2 py-1 text-xs">{p[2]}</span></div><div className="p-5"><p className="text-xs text-zinc-500">{p[3]} قراءة</p><h2 className="mt-2 text-xl font-bold">{p[0]}</h2><p className="mt-2 text-sm text-zinc-400">{p[1]}</p><div className="mt-5 flex gap-4 text-xs text-zinc-500"><span className="flex gap-1"><Eye size={13}/> عرض</span><span className="flex gap-1"><MessageCircle size={13}/> تعليق</span><Bookmark size={13}/></div></div></Link>)}</div></PageFrame>;
}
