import Link from "next/link";
import { 
  ShieldCheck, Clock, Database, 
  Check, ArrowRight, Globe, Sparkles,
  BookOpen, MessageCircle, Wrench 
} from "lucide-react";
import { Metadata } from "next";

// --- 全局配置 (在此处修改你的网站名称) ---
const SITE_CONFIG = {
  name: "FB Shop", // 👈 在这里改成你的网站名字，例如 "Tom的号铺" 或 "FB 666"
  logoHtml: (
    // 👈 这里修改顶部 Logo 的显示样式
    <span className="font-bold text-lg tracking-tight text-zinc-900">
      FB<span className="text-blue-600">Shop</span>
    </span>
  )
};

// --- 1. SEO 元数据配置 ---
export const metadata: Metadata = {
  title: `Facebook老号购买 | 30天满月白号 | ${SITE_CONFIG.name} 自动发货`,
  description: "提供稳定耐用的Facebook 30天+老白号，包含Cookie可直登，适合广告投放与业务推广。纯净IP注册，支持指纹浏览器，Telegram自动发货。",
  keywords: [
    "Facebook账号购买", "FB老号", "Facebook满月号", "FB耐用号", "Facebook cookie号"
  ],
  openGraph: {
    title: "Facebook 30天+ 满月老号 - ¥2.00/个",
    description: "工作室一手货源，稳定耐用，筛选死号",
    type: "website",
    siteName: SITE_CONFIG.name, // 使用配置的名称
    locale: "zh_CN",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1, 
    userScalable: false,
  },
  robots: { index: true, follow: true }
};

// --- 2. 数据配置 ---
const PRODUCT = {
  id: "aged-30-cn",
  title: "Facebook 30天+ 满月老号",
  subtitle: "工作室一手货源 · 稳定耐用 · 适合业务推广",
  price: "2.00",
  displayPrice: "¥2.00",
  currency: "CNY",
  unit: "/ 个",
  buyLink: "https://t.me/Facebookkf_bot",
  tutorialLink: "https://1.584136.xyz",
  features: [
    "注册时长满 30 天以上",
    "包含核心 Cookie (c_user/xs)",
    "筛选死号，保证首登存活",
    "支持指纹浏览器 / 脚本",
    "纯净 IP 注册，权重高",
    "格式: 账号 | 密码 | Cookie"
  ]
};

// --- 3. 结构化数据 (JSON-LD) ---
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": PRODUCT.title,
  "description": `${PRODUCT.title} - ${PRODUCT.subtitle}`,
  "sku": PRODUCT.id,
  "offers": {
    "@type": "Offer",
    "url": PRODUCT.buyLink,
    "priceCurrency": PRODUCT.currency,
    "price": PRODUCT.price,
    "availability": "https://schema.org/InStock"
  }
};

// --- 4. 页面组件 ---
export default function Page() {
  return (
    <div className="min-h-[100dvh] bg-[#F2F2F7] font-sans text-zinc-900 flex flex-col selection:bg-blue-500/20 overflow-x-hidden pb-[env(safe-area-inset-bottom)]">
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 顶部导航 */}
      <header className="sticky top-0 z-50 w-full pt-3 pb-3 px-5 flex justify-between items-center bg-[#F2F2F7]/80 backdrop-blur-lg border-b border-transparent transition-all duration-300 supports-[backdrop-filter]:bg-[#F2F2F7]/60">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-xl shadow-sm border border-zinc-200/50 flex items-center justify-center text-zinc-900">
            <Globe size={18} className="text-blue-600" aria-hidden="true" />
          </div>
          {/* 引用全局配置的 Logo */}
          {SITE_CONFIG.logoHtml}
        </div>
        
        <a 
          href="https://t.me/Facebookkf_bot" 
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white border border-zinc-200/60 text-zinc-600 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm active:bg-zinc-100 active:scale-95 transition-all"
        >
          联系客服
        </a>
      </header>

      {/* 主体内容 */}
      <main className="flex-1 flex flex-col items-center w-full px-4 pt-6 pb-8">
        
        {/* 标题区 */}
        <div className="text-center space-y-3 mb-6 w-full max-w-xs mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100/80 text-blue-700 text-[10px] font-bold uppercase tracking-widest backdrop-blur-sm">
            <Sparkles size={10} aria-hidden="true" />
            精选货源
          </div>
          
          <h1 className="text-[28px] xs:text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 leading-[1.15]">
            稳定耐用的<br/><span className="text-blue-600">FB 老白号购买</span>
          </h1>
          <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed px-4">
            拒绝新号风控。30天+ 沉淀满月号<br className="hidden xs:block"/>Facebook 业务推广首选。
          </p>
        </div>

        {/* 核心商品卡片 */}
        <article className="w-full max-w-[22rem] sm:max-w-sm animate-in fade-in zoom-in duration-700 delay-100 relative">
            
            {/* 背景光效 */}
            <div className="absolute inset-0 bg-blue-500/15 blur-xl rounded-full transform translate-y-4 scale-90 -z-10"></div>
            
            <div className="bg-white rounded-3xl shadow-2xl shadow-zinc-200/80 border border-white/60 overflow-hidden relative">
                
                <div className="absolute top-0 w-full h-28 bg-gradient-to-b from-blue-50/80 to-transparent pointer-events-none"></div>
                <div className="p-5 sm:p-8 relative z-10">
                    
                    <div className="text-center border-b border-zinc-100 pb-4 mb-4 sm:pb-5 sm:mb-5">
                        <h2 className="text-lg sm:text-xl font-bold text-zinc-900">{PRODUCT.title}</h2>
                        <p className="text-[10px] sm:text-xs text-zinc-400 mt-1 font-medium">{PRODUCT.subtitle}</p>
                        
                        <div className="mt-4 sm:mt-5 flex items-end justify-center gap-1 text-zinc-900 leading-none">
                            <span className="text-[2.75rem] sm:text-5xl font-bold tracking-tighter text-blue-600">{PRODUCT.displayPrice}</span>
                            <span className="text-xs sm:text-sm font-medium text-zinc-400 mb-1.5 transform translate-y-0.5">{PRODUCT.unit}</span>
                        </div>
                    </div>

                    <ul className="space-y-2.5 sm:space-y-3 mb-5 sm:mb-6" aria-label="商品特性">
                        {PRODUCT.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-[13px] text-zinc-600">
                                <div className="mt-0.5 w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                    <Check size={10} strokeWidth={4} aria-hidden="true" />
                                </div>
                                <span className="font-medium">{feature}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="space-y-2.5 sm:space-y-3">
                        <Link 
                            href={PRODUCT.buyLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group w-full bg-[#0088cc] hover:bg-[#0099e6] active:bg-[#0077b3] text-white h-11 sm:h-12 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-[0.96] touch-manipulation"
                        >
                            <MessageCircle size={18} aria-hidden="true" />
                            <span>立即购买</span>
                            <ArrowRight size={18} className="opacity-60 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                        </Link>

                        <a 
                            href={PRODUCT.tutorialLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-zinc-50 hover:bg-zinc-100 active:bg-zinc-200 text-zinc-600 h-10 sm:h-11 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all border border-zinc-200/50 active:scale-[0.96] touch-manipulation"
                        >
                            <BookOpen size={16} className="text-zinc-400" aria-hidden="true" />
                            <span>查看登录教程</span>
                        </a>
                    </div>
                    
                    <p className="text-center text-[10px] text-zinc-300 mt-3 sm:mt-4 scale-90 origin-center">
                        * 点击购买将跳转至 Telegram 机器人
                    </p>
                </div>
            </div>
        </article>

        {/* 底部保障 */}
        <div className="mt-8 sm:mt-10 w-full max-w-xs sm:max-w-sm flex justify-between px-2 sm:px-4 opacity-60 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <div className="flex flex-col items-center gap-1">
                <ShieldCheck size={16} className="text-zinc-700" aria-hidden="true" />
                <span className="text-[10px] font-bold text-zinc-500">安全稳定</span>
            </div>
            <div className="w-px h-6 sm:h-8 bg-zinc-300/50 my-auto"></div>
            <div className="flex flex-col items-center gap-1">
                <Clock size={16} className="text-zinc-700" aria-hidden="true" />
                <span className="text-[10px] font-bold text-zinc-500">极速发货</span>
            </div>
            <div className="w-px h-6 sm:h-8 bg-zinc-300/50 my-auto"></div>
            <div className="flex flex-col items-center gap-1">
                <Database size={16} className="text-zinc-700" aria-hidden="true" />
                <span className="text-[10px] font-bold text-zinc-500">Cookie直登</span>
            </div>
        </div>

      </main>

      {/* 页脚 */}
      <footer className="pb-8 sm:pb-10 flex flex-col items-center gap-4 text-[10px] text-zinc-400 font-medium">
        
        {/* 引用全局配置的名称 */}
        <p>© 2024 {SITE_CONFIG.name} · 7x24小时自动发货</p>
        
        <Link 
          href="/tools" 
          className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/60 border border-zinc-200/60 text-zinc-400 hover:text-blue-600 hover:bg-white hover:border-blue-200 active:scale-95 transition-all shadow-sm"
        >
          <Wrench size={12} className="transition-transform group-hover:rotate-12" />
          <span className="font-semibold tracking-wide">效率工具箱</span>
        </Link>
      </footer>
    </div>
  );
}
