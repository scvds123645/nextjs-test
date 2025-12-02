"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Search, ChevronLeft, Loader2, 
  Database, ShieldCheck, Share2, Check, Copy 
} from "lucide-react";

// --- 数据配置 (保持不变) ---
const APPS = [
  {
    id: 1,
    name: "Facebook",
    category: "社交网络",
    desc: "连接你我，分享生活点滴。",
    iconType: "image",
    iconSrc: "https://www.584136.xyz/%E5%A4%B4%E5%83%8F/Facebook_icon.webp",
    link: "https://quwenjian.cc/share/download?key=b703e78f98bf6a75a8e08ce215e5fdb635803d58b049f17b99fd3232f5a1d46b&code=ULPHA",
    price: "获取",
  },
  {
    id: 2,
    name: "Gmail",
    category: "生产力工具",
    desc: "高效、安全、直观的电子邮件服务。",
    iconType: "image",
    iconSrc: "https://www.584136.xyz/%E5%A4%B4%E5%83%8F/Gmail_icon.webp",
    link: "https://quwenjian.cc/share/download?key=8c3fc56d9b8fec6fbdeb859681d1e049bb3c789cdb536995e0c609a9c727bdc7&code=WSO6N",
    price: "获取",
  },
  {
    id: 3,
    name: "Outlook",
    category: "商务办公",
    desc: "随时随地保持联系与协作。",
    iconType: "image",
    iconSrc: "https://www.584136.xyz/%E5%A4%B4%E5%83%8F/Outlook_icon.webp",
    link: "https://quwenjian.cc/share/download?key=08933905a824efbeea556cbef72061fc38d4a18699652ae99a0fbf6efac89d94&code=RZX6G",
    price: "获取",
  },
  {
    id: 4,
    name: "Zoho Mail",
    category: "商务办公",
    desc: "安全、无广告的企业级邮箱。",
    iconType: "image",
    iconSrc: "https://www.584136.xyz/%E5%A4%B4%E5%83%8F/Zoho%20Mail_icon.webp",
    link: "https://quwenjian.cc/share/download?key=df5cd5c66b7241328f46efdc2604caf7b4363589ce1098483ff8f483ddc71938&code=13HA9",
    price: "获取",
  },
  {
    id: 5,
    name: "Via浏览器",
    category: "实用工具",
    desc: "极简、快速、纯净的手机浏览器。",
    iconType: "image",
    iconSrc: "https://www.584136.xyz/%E5%A4%B4%E5%83%8F/Via_6.8.0.apk_icon.webp",
    link: "https://res.viayoo.com/v1/via-release-cn.apk",
    price: "获取",
  },
  {
    id: 6,
    name: "绿茶VPN",
    category: "网络工具",
    desc: "快速稳定的网络连接服务。",
    iconType: "image",
    iconSrc: "https://www.584136.xyz/%E5%A4%B4%E5%83%8F/%E7%BB%BF%E8%8C%B6VPN_icon.webp",
    link: "https://quwenjian.cc/share/download?key=86241c3ad7502c7370372fdde2a1a423bb97f581ec8b7463aa9623754441e7f7&code=YIVYA",
    price: "获取",
  },
  {
    id: 7,
    name: "Discord",
    category: "社交网络",
    desc: "游戏玩家和社区的聚集地。",
    iconType: "image",
    iconSrc: "https://www.584136.xyz/%E5%A4%B4%E5%83%8F/Discord_icon.webp",
    link: "https://quwenjian.cc/share/download?key=29eb683c5e92e7d340bbe7cff8c830369416921513ce89de55b602257758c119&code=E3A9B",
    price: "获取",
  },
  {
    id: 8,
    name: "脸书白号卡网",
    category: "在线商店",
    desc: "高质量 FB 账号自助购买平台。",
    iconType: "image",
    iconSrc: "https://www.584136.xyz/%E5%A4%B4%E5%83%8F/telegam@fb180.jpg",
    link: "https://fh10.zmfaka.cn/item/c24vp9/",
    price: "访问",
  },
  {
    id: 9,
    name: "3W+ 未180脸书账号",
    category: "数据资源",
    desc: "海量未验证账号数据合集（TXT格式）。",
    iconType: "svg",
    iconSrc: null,
    link: "https://quwenjian.cc/share/download?key=0d5a04e745f8d04ae5c327f7c4ccb29232daefa6dfb37ab79b6542c57174d64f&code=53HWU",
    price: "下载",
  },
];

export default function AppStore() {
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedAppId, setHighlightedAppId] = useState<number | null>(null);

  useEffect(() => {
    document.title = "资源中心";
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith("#app-")) {
        const appId = parseInt(hash.replace("#app-", ""), 10);
        if (!isNaN(appId)) {
          setHighlightedAppId(appId);
          const element = document.getElementById(`app-${appId}`);
          if (element) {
            setTimeout(() => {
              element.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 300); // 增加一点延迟，确保移动端页面完全展开
          }
          setTimeout(() => setHighlightedAppId(null), 3000);
        }
      }
    };
    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const filteredApps = APPS.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F5F5F7] font-sans text-zinc-900 selection:bg-blue-500/20 pb-[env(safe-area-inset-bottom)]">
      
      {/* --- Header (移动端优化：更紧凑的布局) --- */}
      <header className="sticky top-0 z-50 bg-[#F5F5F7]/90 backdrop-blur-xl border-b border-zinc-200/60">
        <div className="max-w-6xl mx-auto px-4 h-14 md:h-16 flex items-center gap-2 md:gap-3">
          
          {/* 返回按钮 (增大点击区域) */}
          <Link href="/tools" className="active:scale-90 transition-transform touch-manipulation">
            <div className="w-9 h-9 bg-white hover:bg-zinc-50 border border-zinc-200 rounded-xl flex items-center justify-center text-zinc-600 shadow-sm">
                <ChevronLeft size={22} className="relative -left-[1px]" />
            </div>
          </Link>
          
          {/* 搜索框 (移动端全宽) */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text" 
              placeholder="搜索资源..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 bg-zinc-200/60 focus:bg-white border border-transparent focus:border-blue-500/20 rounded-xl pl-10 pr-4 text-[15px] outline-none transition-all placeholder:text-zinc-500/70"
            />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-4 space-y-6">
        
        {/* --- App List Section --- */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-3 px-1 flex items-center justify-between">
                <h2 className="text-xl font-bold text-zinc-900">热门推荐</h2>
                <span className="text-xs text-zinc-400 font-medium">{filteredApps.length} 个应用</span>
            </div>
            
            {/* Grid: 移动端单列，平板双列，桌面三列 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
                {filteredApps.map((app) => (
                    <AppCard 
                        key={app.id} 
                        app={app} 
                        isHighlighted={highlightedAppId === app.id}
                    />
                ))}
                
                {filteredApps.length === 0 && (
                    <div className="col-span-full py-16 text-center flex flex-col items-center justify-center text-zinc-400">
                        <Search size={48} className="opacity-20 mb-4" />
                        <p className="text-sm">未找到相关应用</p>
                    </div>
                )}
            </div>
        </section>

        <footer className="pt-6 pb-12 text-center">
            <p className="text-[10px] text-zinc-400/80 transform scale-90">
                © 2024 资源中心
            </p>
        </footer>

      </main>
    </div>
  );
}

// --- 适配版卡片组件 ---
function AppCard({ app, isHighlighted }: { app: typeof APPS[0], isHighlighted: boolean }) {
    return (
        <div 
            id={`app-${app.id}`} 
            className={`
                group relative bg-white p-3.5 rounded-[1.25rem] 
                border transition-all duration-500 flex items-center gap-3.5
                active:scale-[0.99] touch-manipulation
                ${isHighlighted 
                    ? "border-blue-500 shadow-[0_0_0_2px_rgba(59,130,246,0.2)] z-10" 
                    : "border-zinc-100 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                }
            `}
        >
            {/* 
                分享按钮 
                - 移动端：增大可点击区域，放置在右上角
                - 交互：不占用文档流，悬浮显示 
            */}
            <div className="absolute top-0 right-0 p-2 z-20">
               <ShareButton appId={app.id} appName={app.name} />
            </div>

            {/* Icon: 移动端固定 60px, 桌面稍大 */}
            <div className="shrink-0">
                {app.iconType === "image" ? (
                    <img 
                        src={app.iconSrc!} 
                        alt={app.name} 
                        className="w-[3.75rem] h-[3.75rem] md:w-20 md:h-20 rounded-[0.9rem] md:rounded-[1.2rem] shadow-sm border border-zinc-100/50 object-cover bg-zinc-50"
                    />
                ) : (
                    <div className="w-[3.75rem] h-[3.75rem] md:w-20 md:h-20 rounded-[0.9rem] md:rounded-[1.2rem] bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-sm">
                        <Database size={28} />
                    </div>
                )}
            </div>
            
            {/* 
                Text Info 
                - pr-9: 为右上角的分享按钮留出空间，防止文字重叠 
                - min-w-0: 防止 flex 子项溢出
            */}
            <div className="flex-1 min-w-0 flex flex-col justify-center pr-9"> 
                <h3 className="font-bold text-[15px] md:text-lg text-zinc-900 truncate">{app.name}</h3>
                <p className="text-[10px] md:text-xs text-zinc-400 font-medium uppercase tracking-wider mb-0.5">{app.category}</p>
                {/* 移动端显示 1 行简介，保持界面清爽 */}
                <p className="text-xs text-zinc-500 line-clamp-1 leading-relaxed">{app.desc}</p>
            </div>
            
            {/* Action Button */}
            <div className="shrink-0 flex flex-col items-center justify-center pl-1">
                 <GetButton label={app.price} downloadLink={app.link} />
            </div>
        </div>
    );
}

// --- 智能分享按钮 (原生 + 剪贴板降级) ---
function ShareButton({ appId, appName }: { appId: number, appName: string }) {
    const [status, setStatus] = useState<"idle" | "copied">("idle");

    const handleShare = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const url = `${window.location.origin}${window.location.pathname}#app-${appId}`;
        const shareData = {
            title: `推荐资源: ${appName}`,
            text: `我在资源中心发现了 ${appName}，快来看看！`,
            url: url
        };

        // 1. 尝试调用手机原生分享菜单
        if (navigator.share) {
            try {
                await navigator.share(shareData);
                return; // 如果分享成功，直接返回，不需要显示"已复制"
            } catch (err) {
                // 用户取消分享或不支持，继续执行下面的复制逻辑
                console.log("Share cancelled or failed, falling back to copy");
            }
        }

        // 2. 降级方案：复制到剪贴板
        navigator.clipboard.writeText(url).then(() => {
            setStatus("copied");
            setTimeout(() => setStatus("idle"), 2000);
        }).catch(() => {
            alert("复制失败，请手动复制链接");
        });
    };

    return (
        <button 
            onClick={handleShare}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-transparent hover:bg-zinc-100 text-zinc-300 hover:text-zinc-600 transition-colors active:scale-90 active:bg-zinc-200"
            title="分享"
        >
            {status === "copied" ? (
                <Check size={14} className="text-green-500 font-bold" />
            ) : (
                // 在移动端，如果支持 navigator.share，通常显示分享图标会更直观
                <Share2 size={16} strokeWidth={2.5} />
            )}
        </button>
    );
}

// --- GET 按钮 (适配触摸) ---
function GetButton({ label = "获取", downloadLink }: { label?: string, downloadLink: string }) {
    const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

    const handleClick = () => {
        if (status !== "idle") return;
        setStatus("loading");
        
        setTimeout(() => {
            setStatus("done");
            window.open(downloadLink, '_blank');
            setTimeout(() => setStatus("idle"), 3000);
        }, 600); 
    };

    return (
        <button
            onClick={handleClick}
            className={`
                relative overflow-hidden font-bold text-xs tracking-wide rounded-full transition-all duration-300
                flex items-center justify-center select-none shadow-sm
                ${status === "idle" 
                    ? "bg-[#F2F2F7] text-[#007AFF] active:bg-[#E5E5EA] w-[4.2rem] h-[1.75rem]" // iOS 风格按钮颜色
                    : ""}
                ${status === "loading" 
                    ? "w-[1.75rem] h-[1.75rem] bg-[#F2F2F7] cursor-wait" 
                    : ""}
                ${status === "done" 
                    ? "bg-transparent text-zinc-400 ring-1 ring-inset ring-zinc-200 w-[4.2rem] h-[1.75rem]" 
                    : ""}
            `}
        >
            <span className={`absolute transition-all duration-300 ${status === "idle" ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}>
                {label}
            </span>
            <Loader2 
                className={`absolute animate-spin text-zinc-400 ${status === "loading" ? "opacity-100" : "opacity-0"}`} 
                size={14} 
            />
            <span className={`absolute text-[10px] transition-all duration-300 ${status === "done" ? "opacity-100 scale-100" : "opacity-0 scale-150"}`}>
                打开
            </span>
        </button>
    )
}
