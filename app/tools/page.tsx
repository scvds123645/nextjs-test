"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Hash, Cookie, RefreshCw, Repeat2, 
  ArrowRight, ChevronLeft, Globe, ChevronRight, 
  ShoppingBag, Calendar 
} from "lucide-react";

// --- 工具配置列表 ---
const TOOLS = [
  {
    id: "number-extractor",
    name: "数字提取工具",
    desc: "从乱序文本中批量提取 14 位或其他长度的数字编码",
    path: "/number-extractor",
    icon: <Hash className="w-6 h-6 md:w-8 md:h-8 text-white" aria-hidden="true" />,
    color: "bg-orange-500",
  },
  {
    id: "cookie-filter",
    name: "Cookie 筛选器",
    desc: "一键提取 Netscape/JSON 中的 c_user 和 xs 核心字段",
    path: "/cookie-filter",
    icon: <Cookie className="w-6 h-6 md:w-8 md:h-8 text-white" aria-hidden="true" />,
    color: "bg-blue-500",
  },
  {
    id: "cookie-converter",
    name: "Cookie 格式转换",
    desc: "自动拼接 UID、密码和 Cookie，生成标准化格式",
    path: "/cookie-converter",
    icon: <RefreshCw className="w-6 h-6 md:w-8 md:h-8 text-white" aria-hidden="true" />,
    color: "bg-indigo-500",
  },
  {
    id: "text-deduplicator",
    name: "文本去重工具",
    desc: "智能文本去重与清洗，支持自定义分隔符与正则",
    path: "/text-deduplicator",
    icon: <Repeat2 className="w-6 h-6 md:w-8 md:h-8 text-white" aria-hidden="true" />,
    color: "bg-emerald-500",
  },
  {
    id: "fb-uid-checker",
    name: "FB UID 检测器",
    desc: "Facebook UID 批量在线检测，快速筛选有效账号",
    path: "https://3.584136.xyz/",
    icon: <Globe className="w-6 h-6 md:w-8 md:h-8 text-white" aria-hidden="true" />,
    color: "bg-sky-600",
  },
  {
    id: "spring-festival-countdown",
    name: "春节倒计时",
    desc: "看看距离下一个农历新年还有多少天",
    path: "https://4.584136.xyz/",
    icon: <Calendar className="w-6 h-6 md:w-8 md:h-8 text-white" aria-hidden="true" />,
    color: "bg-red-500",
  },
  // --- ✨ I've added the new tool here! ✨ ---
  {
    id: "fb-cookie-injector", // 建议 ID 也同步改为非 guide 后缀
    name: "FB Cookie 注入器", // 文案更具体
    desc: "支持 Netscape/JSON 格式 Cookie 一键注入，免密登录", // 强调功能性
    path: "/facebook-cookie-injector",
    icon: <ArrowRight className="w-6 h-6 md:w-8 md:h-8 text-white" aria-hidden="true" />,
    color: "bg-purple-500",
  },
  {
    id: "software-store",
    name: "软件商店",
    desc: "常用软件在线安装与下载",
    path: "/app-store",
    icon: <ShoppingBag className="w-6 h-6 md:w-8 md:h-8 text-white" aria-hidden="true" />,
    color: "bg-rose-500",
  },
];

// JSON-LD 数据 (SEO优化)
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "itemListElement": TOOLS.map((tool, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "item": {
      "@type": "SoftwareApplication",
      "name": tool.name,
      "description": tool.desc,
      "applicationCategory": "UtilityApplication",
      "operatingSystem": "Web",
      "url": tool.path.startsWith("http") ? tool.path : `https://your-domain.com${tool.path}`
    }
  }))
};

export default function ToolsPage() {
  const router = useRouter();

  // --- 核心逻辑：处理点击延迟 ---
  // 优化：将延迟减少到 150ms，既能看清动画，又不会感觉太慢
  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (path.startsWith("http")) return;
    
    // 如果按住 Ctrl/Cmd 点击（新标签页打开），则不拦截
    if (e.metaKey || e.ctrlKey) return;
    e.preventDefault(); 
    setTimeout(() => {
      router.push(path);
    }, 150); 
  };

  return (
    <div 
      className="min-h-[100dvh] bg-[#F2F2F7] font-sans text-zinc-900 selection:bg-blue-500/20 flex flex-col select-none overflow-x-hidden"
      // 移除点击高亮颜色，使用自定义 active 样式
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#F2F2F7]/90 backdrop-blur-xl border-b border-zinc-200/80 transition-all">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-[3.5rem] md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            
            {/* 返回按钮 */}
            <Link 
              href="/" 
              onClick={(e) => handleNavigation(e, "/")}
              aria-label="返回首页" 
              className="group outline-none relative z-10"
            >
              <div className="w-9 h-9 md:w-10 md:h-10 bg-white rounded-full md:rounded-xl shadow-[0_1px_2px_rgba(0,0,0,0.06)] border border-zinc-200/80 flex items-center justify-center text-zinc-900 shrink-0 
                transition-all duration-300 ease-out
                active:scale-90 active:bg-zinc-100 active:duration-150
                md:group-hover:bg-zinc-50 md:group-hover:border-zinc-300 
                transform-gpu will-change-transform">
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-zinc-500 md:group-hover:text-zinc-900" />
              </div>
            </Link>
            
            <div className="flex flex-col justify-center pl-1">
              <h1 className="text-[17px] md:text-xl font-bold tracking-tight text-zinc-900 leading-tight">
                效率工具箱
              </h1>
              <p className="hidden md:block text-xs text-zinc-500 font-medium">汇聚实用工具，提升工作效率</p>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      {/* 增加底部 padding 以适应全面屏手势条 */}
      <main className="flex-1 max-w-5xl mx-auto px-4 py-4 md:px-6 md:py-12 w-full pb-[calc(env(safe-area-inset-bottom)+2rem)]">
        
        <h2 className="sr-only">工具列表</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
          {TOOLS.map((tool) => {
            const isExternal = tool.path.startsWith("http");
            
            return (
              <Link 
                href={tool.path} 
                key={tool.id}
                onClick={(e) => handleNavigation(e, tool.path)}
                className="block h-full outline-none focus:outline-none ring-0"
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                aria-label={`打开 ${tool.name}`}
              >
                <article className="group relative h-full bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 
                  border border-zinc-100 md:border-transparent md:shadow-sm
                  transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]
                  
                  /* 移动端交互核心：按下时显著缩小 + 背景变暗 */
                  active:scale-[0.97] active:bg-zinc-50 active:duration-150
                  
                  /* 桌面端 Hover 效果 */
                  md:hover:shadow-xl md:hover:shadow-zinc-200/60 md:hover:-translate-y-1 md:hover:border-zinc-200 
                  
                  transform-gpu will-change-transform touch-manipulation
                  flex flex-row md:flex-col items-center md:items-start justify-between gap-4">
                  
                  {/* Icon Container */}
                  <div className={`
                    w-[3.25rem] h-[3.25rem] md:w-16 md:h-16 
                    rounded-[14px] md:rounded-2xl 
                    ${tool.color} 
                    shadow-sm shadow-zinc-200 
                    flex items-center justify-center shrink-0 
                    md:mb-6 
                    transform transition-transform duration-500 
                    md:group-hover:scale-110 md:group-hover:rotate-3
                  `}>
                    {tool.icon}
                  </div>
                  
                  {/* Text Content */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center md:block">
                    <div className="flex items-center justify-between">
                       <h3 className="text-[17px] md:text-xl font-bold text-zinc-900 md:mb-2 md:group-hover:text-blue-600 transition-colors truncate">
                         {tool.name}
                       </h3>
                    </div>
                    
                    <p className="text-[13px] md:text-sm text-zinc-500/90 leading-snug line-clamp-2 md:line-clamp-none font-medium">
                      {tool.desc}
                    </p>
                  </div>

                  {/* Arrow / Action Indicator */}
                  <div className="flex items-center shrink-0 md:mt-8 md:w-full">
                    {/* 移动端：右侧小箭头，模仿 iOS TableView Cell */}
                    <ChevronRight className="w-5 h-5 text-zinc-300/80 md:hidden" strokeWidth={2.5} />
                    {/* 桌面端：底部文字链接 */}
                    <div className="hidden md:flex items-center text-sm font-semibold text-zinc-300 group-hover:text-blue-500 transition-colors w-full">
                       <span>{isExternal ? "访问站点" : "立即使用"}</span>
                       <ArrowRight className="ml-auto w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
          
          {/* "更多工具" 占位符 - 移动端优化为简单的虚线框 */}
          <div className="
            h-full min-h-[70px] md:min-h-[240px]
            border-2 border-dashed border-zinc-200 
            rounded-2xl md:rounded-3xl 
            p-4 md:p-6 
            flex md:flex-col items-center justify-center md:text-center gap-3 
            text-zinc-400 bg-white/50
            cursor-default select-none
          ">
             <div className="w-8 h-8 md:w-12 md:h-12 bg-zinc-100 rounded-full flex items-center justify-center shrink-0">
                <span className="text-lg md:text-xl font-bold">+</span>
             </div>
             <p className="text-[13px] md:text-sm font-medium">更多工具 敬请期待...</p>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center pb-[calc(env(safe-area-inset-bottom)+1rem)]">
        <p className="text-[11px] md:text-xs text-zinc-400 font-medium">
          致力于为您提供极致的效率体验
        </p>
      </footer>
    </div>
  );
}
