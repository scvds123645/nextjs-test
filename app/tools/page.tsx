import Link from "next/link";
import { 
  ArrowLeft, 
  AppWindow, 
  RefreshCcw, 
  Filter, 
  Facebook, 
  Hash, 
  CopyMinus, 
  Sparkles,
  ChevronRight
} from "lucide-react";

// 定义工具数据结构
type ToolItem = {
  path: string;
  title: string;
  desc: string;
  icon: React.ElementType;
  color: string; // 用于图标和渐变背景
  span?: string; // Bento Grid 跨度控制 (可选)
};

const tools: ToolItem[] = [
  {
    path: "/app-store",
    title: "App Store 洞察",
    desc: "探索应用市场数据，实时洞察榜单趋势。",
    icon: AppWindow,
    color: "from-blue-500 to-cyan-400",
  },
  {
    path: "/text-deduplicator",
    title: "文本去重",
    desc: "高效移除重复内容，精简文本结构。",
    icon: CopyMinus,
    color: "from-rose-500 to-orange-400",
  },
  {
    path: "/number-extractor",
    title: "数值提取器",
    desc: "从复杂非结构化文本中快速清洗提取数字。",
    icon: Hash,
    color: "from-violet-500 to-purple-400",
  },
  {
    path: "/facebook-cookie-injector",
    title: "FB 凭证注入",
    desc: "自动化注入 Cookie，无缝对接社交平台。",
    icon: Facebook,
    color: "from-indigo-500 to-blue-600",
    span: "col-span-2", // 强调项，占据整行
  },
  {
    path: "/cookie-converter",
    title: "Cookie 转换",
    desc: "JSON/Netscape 格式互转，适配多环境。",
    icon: RefreshCcw,
    color: "from-emerald-500 to-teal-400",
  },
  {
    path: "/cookie-filter",
    title: "Cookie 净化",
    desc: "智能筛选关键 Key，清洗冗余数据。",
    icon: Filter,
    color: "from-amber-500 to-yellow-400",
  },
];

export default function ToolsPage() {
  return (
    // 页面容器：深色背景，居中布局模拟移动端视窗
    <main className="min-h-screen w-full bg-[#050505] flex justify-center overflow-x-hidden selection:bg-white/20">
      
      {/* 移动端视窗限制容器 */}
      <div className="w-full max-w-md relative flex flex-col pb-10">
        
        {/* 背景装饰：环境光 (Ambient Light) */}
        <div className="fixed top-[-20%] left-[-20%] w-[80%] h-[50%] bg-purple-900/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[60%] h-[40%] bg-blue-900/10 blur-[80px] rounded-full pointer-events-none" />

        {/* 顶部导航栏：磨砂玻璃效果 */}
        <header className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between bg-[#050505]/60 backdrop-blur-xl border-b border-white/5">
          <Link 
            href="/" 
            className="p-2 -ml-2 rounded-full hover:bg-white/10 active:scale-95 transition-all text-zinc-300 hover:text-white group"
            aria-label="Back to Home"
          >
            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium tracking-wider text-zinc-400 uppercase">Tools</span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </header>

        {/* 主要内容区域 */}
        <div className="px-4 py-6 z-10">
          
          {/* 标题区 */}
          <div className="mb-8 px-2">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-200 to-zinc-500">
              效能工具箱
            </h1>
            <p className="mt-2 text-zinc-500 text-sm flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-yellow-500/80" />
              数据处理中心
            </p>
          </div>

          {/* Bento Grid 布局 */}
          <div className="grid grid-cols-2 gap-3 auto-rows-auto">
            {tools.map((tool) => (
              <Link 
                key={tool.path} 
                href={tool.path}
                className={`group relative ${tool.span || "col-span-1"}`}
              >
                {/* 卡片边框渐变效果 */}
                <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-white/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* 卡片主体 */}
                <div className="relative h-full bg-[#111111]/80 backdrop-blur-md rounded-2xl p-4 border border-white/5 overflow-hidden transition-transform duration-300 active:scale-[0.98]">
                  
                  {/* 悬停时的微光效果 */}
                  <div className={`absolute -right-12 -top-12 w-24 h-24 bg-gradient-to-br ${tool.color} blur-[50px] opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                  
                  <div className="flex flex-col h-full justify-between gap-3">
                    {/* 图标区 */}
                    <div className="flex justify-between items-start">
                      <div className={`p-2.5 rounded-xl bg-gradient-to-br ${tool.color} shadow-lg shadow-black/40 text-white ring-1 ring-white/10`}>
                        <tool.icon className="w-5 h-5" strokeWidth={2.5} />
                      </div>
                      
                      {/* 右上角箭头，仅在悬停或大卡片显示 */}
                      <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
                    </div>

                    {/* 文本内容区 */}
                    <div>
                      <h3 className="text-base font-bold text-zinc-100 group-hover:text-white tracking-tight mb-1">
                        {tool.title}
                      </h3>
                      <p className="text-[11px] leading-relaxed text-zinc-400 font-medium line-clamp-2">
                        {tool.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* 底部装饰文案 */}
          <div className="mt-12 text-center">
            <p className="text-[10px] text-zinc-700 uppercase tracking-widest font-semibold">
              Designed for Efficiency
            </p>
          </div>
          
        </div>
      </div>
    </main>
  );
}