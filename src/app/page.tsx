import Link from "next/link";
import { ArrowLeft, Clock3, Flame, MessageCircle, ThumbsUp } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import TopAdvertisement from "@/components/TopAdvertisement";

const categories = ["آخر الأخبار","محلي","عالمي","رياضة","تكنولوجيا","اقتصاد","منوعات","إعلام وفن","مقالات وتحليلات"];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#080a10]">
      <SiteHeader />
      <TopAdvertisement />
      <main>
        <section className="border-b border-white/5 bg-[#101522]"><div className="container-warm flex items-center gap-6 overflow-x-auto py-3">{categories.map((item,i)=><Link href={i ? `/category/${encodeURIComponent(item)}` : "/news"} key={item} className={`shrink-0 text-sm ${i===0?"text-[#ed1728]":"text-zinc-400"} hover:text-white`}>{item}</Link>)}</div></section>
        <section className="container-warm py-6">
          <div className="mb-5 flex items-center justify-between rounded-xl border border-[#ed1728]/30 bg-[#ed1728]/8 px-4 py-3">
            <div className="flex items-center gap-3"><span className="rounded-lg red-gradient px-2 py-1 text-xs font-bold">عاجل</span><p className="text-sm text-zinc-200">تابع آخر التطورات مباشرة عبر Warm Media</p></div>
            <Link href="/breaking" className="hidden items-center gap-1 text-xs text-zinc-400 sm:flex">كل الأخبار العاجلة <ArrowLeft size={14}/></Link>
          </div>
          <div className="grid gap-5 lg:grid-cols-[1.55fr_.75fr]">
            <Link href="/news" className="glass group relative min-h-[390px] overflow-hidden rounded-3xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(237,23,40,.25),transparent_36%),linear-gradient(135deg,#171d2d,#090b12)]"/>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/75 to-transparent p-7 md:p-9">
                <span className="mb-3 inline-block rounded-md bg-[#ed1728] px-2.5 py-1 text-xs font-bold">أحدث خبر</span>
                <h1 className="m-0 text-3xl font-bold leading-tight md:text-5xl">أخبار حقيقية.. بعيون مختلفة</h1>
                <p className="mt-3 max-w-xl text-sm text-zinc-300 md:text-base">تابع التفاصيل والتحليلات المتخصصة من خلال منصة Warm Media.</p>
                <div className="mt-5 flex items-center gap-4 text-xs text-zinc-400"><span className="flex items-center gap-1"><Clock3 size={14}/> الآن</span><span className="flex items-center gap-1"><MessageCircle size={14}/> انضم للنقاش</span></div>
              </div>
            </Link>
            <aside className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {[["أكثر قراءة","متابعة فورية لأهم القضايا المحلية والعالمية"],["موجز المساء","ملخص سريع لأهم التطورات خلال اليوم"],["المجتمع","شارك الرأي في نقاشات مفتوحة بإخفاء الهوية"]].map((item,i)=>(
                <Link href={i===2?"/community":"/news"} key={item[0]} className="glass rounded-2xl p-5 transition hover:-translate-y-1 hover:border-[#ed1728]/40">
                  <div className="mb-4 flex items-center justify-between"><span className="text-xs text-[#ed1728]">{item[0]}</span>{i===0?<Flame size={18} className="text-[#ed1728]"/>:<ArrowLeft size={18} className="text-zinc-500"/>}</div>
                  <h2 className="font-bold leading-7">{item[1]}</h2>
                </Link>
              ))}
            </aside>
          </div>
        </section>
        <section className="container-warm pb-12">
          <div className="mb-5 flex items-end justify-between"><div><p className="text-xs text-[#ed1728]">آخر المستجدات</p><h2 className="mt-1 text-2xl font-bold">أحدث الأخبار</h2></div><Link href="/news" className="text-sm text-zinc-400">عرض الكل</Link></div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[["تحليل اقتصادي","قراءات في المشهد الاقتصادي العالمي","اقتصاد"],["رياضة حرة","أبرز المحطات وأحدث النتائج","رياضة"],["عالم التكنولوجيا","ما القادم في الابتكار والذكاء الاصطناعي","تكنولوجيا"]].map((post,i)=>(
              <Link href={`/news/post-${i+1}`} key={post[0]} className="glass group overflow-hidden rounded-2xl">
                <div className="h-44 bg-[linear-gradient(135deg,#1b2234,#0d1018)] p-5"><span className="rounded-md bg-white/10 px-2 py-1 text-xs">{post[2]}</span></div>
                <div className="p-5"><h3 className="text-lg font-bold group-hover:text-[#ed1728]">{post[0]}</h3><p className="mt-2 text-sm text-zinc-400 line-clamp-2">{post[1]}</p><div className="mt-5 flex items-center gap-4 text-xs text-zinc-500"><span className="flex gap-1"><ThumbsUp size={13}/> تفاعل</span><span className="flex gap-1"><MessageCircle size={13}/> تعليق</span></div></div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <footer className="border-t border-white/5 py-8"><div className="container-warm flex flex-col gap-4 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between"><span>© 2026 Warm Media</span><div className="flex gap-5"><Link href="/privacy">الخصوصية</Link><Link href="/terms">الشروط</Link><Link href="/support">الدعم</Link></div></div></footer>
    </div>
  );
}
