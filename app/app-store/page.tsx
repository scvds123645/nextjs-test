"use client";

import { useState } from "react";
import { 
  Search, LayoutGrid, Loader2, 
  Database, 
  ShieldCheck 
} from "lucide-react";

// --- 1. 真实数据配置 (已汉化) ---
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
    price: "访问", // 商店链接
  },
  {
    id: 9,
    name: "3W+ 未180脸书账号",
    category: "数据资源",
    desc: "海量未验证账号数据合集（TXT格式）。",
    iconType: "svg",
    iconSrc: null,
    link: "https://quwenjian.cc/share/download?key=0d5a04e745f8d04ae5c327f7c4ccb29232daefa6dfb37ab79b6542c57174d64f&code=53HWU",
    price: "下载", // 文件资源
  },
];

export default function AppStore() {
  const [searchTerm, setSearchTerm] = useState("");

  // 过滤逻辑
  const filteredApps = APPS.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F5F5F7] font-sans text-zinc-900 selection:bg-blue-500/20 pb-[env(safe-area-inset-bottom)]">
      
      {/* --- Header --- */}
      <header className="sticky top-0 z-50 bg-[#F5F5F7]/85 backdrop-blur-md border-b border-zinc-200/60 supports-[backdrop-filter]:bg-[#F5F5F7]/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 md:h-16 flex items-center gap-3">
          
          {/* Logo */}
          <div className="w-8 h-8 md:w-9 md:h-9 bg-zinc-900 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm">
              <LayoutGrid size={16} className="md:w-5 md:h-5" />
          </div>
          
          {/* Search Bar */}
          <div className="relative group flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-500 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="搜索应用、资源..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-200/60 focus:bg-white border border-transparent focus:border-blue-500/20 rounded-xl py-2 pl-9 pr-4 text-sm outline-none transition-all duration-300 placeholder:text-zinc-500/80 shadow-inner md:shadow-none"
            />
          </div>

          {/* Avatar Placeholder */}
          <div className="hidden md:block w-8 h-8 rounded-full bg-zinc-200 border border-zinc-300" />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        
        {/* --- App List Section --- */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-4 px-1">
                <h2 className="text-xl md:text-2xl font-bold text-zinc-900 tracking-tight">热门推荐</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredApps.map((app) => (
                    <AppCard key={app.id} app={app} />
                ))}
                
                {filteredApps.length === 0 && (
                    <div className="col-span-full py-12 text-center flex flex-col items-center justify-center text-zinc-400">
                        <Search size={48} className="opacity-20 mb-4" />
                        <p>未找到与 "{searchTerm}" 匹配的内容</p>
                    </div>
                )}
            </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 pb-12 border-t border-zinc-200 text-center">
            <p className="text-xs text-zinc-400">
                版权所有 © 2024 资源中心 保留所有权利
            </p>
        </footer>
      </main>
    </div>
  );
}

// --- 子组件：App 卡片 ---
function AppCard({ app }: { app: typeof APPS[0] }) {
    return (
        <div className="group bg-white p-3 md:p-4 rounded-2xl md:rounded-3xl shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] border border-zinc-100 md:hover:shadow-xl md:hover:shadow-zinc-200/50 md:hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 md:gap-4 active:scale-[0.98]">
            
            {/* Icon */}
            <div className="shrink-0 group-hover:scale-105 transition-transform duration-300">
                {app.iconType === "image" ? (
                    <img 
                        src={app.iconSrc!} 
                        alt={app.name} 
                        className="w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-[1.2rem] shadow-md shadow-zinc-200 object-cover bg-zinc-50"
                    />
                ) : (
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-[1.2rem] bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-md shadow-zinc-200 text-white">
                        <Database size={32} />
                    </div>
                )}
            </div>
            
            {/* Text Info */}
            <div className="flex-1 min-w-0 flex flex-col justify-center py-0.5">
                <h3 className="font-semibold text-base md:text-lg text-zinc-900 truncate leading-tight">{app.name}</h3>
                <p className="text-[10px] md:text-xs text-zinc-400 font-medium mb-0.5 uppercase tracking-wide">{app.category}</p>
                <p className="text-xs text-zinc-500 line-clamp-1 md:line-clamp-2 leading-relaxed hidden xs:block">{app.desc}</p>
            </div>
            
            {/* Action Button */}
            <div className="shrink-0 flex flex-col items-center justify-center pl-1">
                 <GetButton label={app.price} downloadLink={app.link} />
                 <span className="text-[9px] md:text-[10px] text-zinc-400 mt-1 font-medium scale-90 md:scale-100 origin-top flex items-center gap-0.5">
                    <ShieldCheck size={10} /> 安全认证
                 </span>
            </div>
        </div>
    );
}

// --- 子组件：GET 按钮 (状态汉化) ---
function GetButton({ label = "获取", downloadLink }: { label?: string, downloadLink: string }) {
    const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

    const handleClick = () => {
        if (status !== "idle") return;
        
        setStatus("loading");
        
        setTimeout(() => {
            setStatus("done");
            window.open(downloadLink, '_blank');
            
            setTimeout(() => {
                setStatus("idle");
            }, 3000);
        }, 800); 
    };

    return (
        <button
            onClick={handleClick}
            className={`
                relative overflow-hidden font-bold text-xs md:text-sm tracking-wide rounded-full transition-all duration-500
                flex items-center justify-center select-none
                ${status === "idle" 
                    ? "bg-zinc-100 text-blue-600 hover:bg-blue-100 w-[4.5rem] h-7 md:w-20 md:h-8 active:scale-90" 
                    : ""}
                ${status === "loading" 
                    ? "w-7 h-7 md:w-8 md:h-8 bg-zinc-100 cursor-wait" 
                    : ""}
                ${status === "done" 
                    ? "bg-transparent text-zinc-400 ring-1 md:ring-2 ring-inset ring-zinc-200 w-[4.5rem] h-7 md:w-20 md:h-8 cursor-default" 
                    : ""}
            `}
        >
            {/* 按钮文字：获取/访问/下载 */}
            <span className={`absolute transition-all duration-300 ${status === "idle" ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}>
                {label}
            </span>
            
            {/* 加载圈 */}
            <Loader2 
                className={`absolute animate-spin text-zinc-400 transition-all duration-300 ${status === "loading" ? "opacity-100 scale-100" : "opacity-0 scale-50"}`} 
                size={14} 
                strokeWidth={3}
            />
            
            {/* 完成文字：打开 */}
            <span className={`absolute transition-all duration-300 ${status === "done" ? "opacity-100 scale-100 font-semibold" : "opacity-0 scale-150"}`}>
                打开
            </span>
        </button>
    )
}
