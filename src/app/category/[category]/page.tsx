import PageFrame from "@/components/PageFrame";
export default function CategoryPage({params}:{params:{category:string}}){return <PageFrame title={decodeURIComponent(params.category)} subtitle="تصنيف الأخبار"><div className="glass rounded-2xl p-8 text-center text-zinc-400">لا توجد أخبار منشورة حاليًا في هذا التصنيف.</div></PageFrame>}
