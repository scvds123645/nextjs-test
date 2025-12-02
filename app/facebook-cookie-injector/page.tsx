import React from 'react';
import {
  Cookie,
  ShieldCheck,
  Download,
  Smartphone,
  Zap,
  ChevronRight,
  ChevronLeft // 引入左箭头图标
} from 'lucide-react';

// -----------------------------------------------------------------------------
// Components
// -----------------------------------------------------------------------------

const Button = ({
  children,
  variant = 'primary',
  className = '',
  onClick,
  href
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
  onClick?: () => void;
  href?: string;
}) => {
  const baseStyle = "w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-medium transition-all duration-300 active:scale-[0.98]";
  
  const variants = {
    primary: "bg-[#0866FF] text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:bg-[#0759E0]",
    secondary: "bg-white/70 backdrop-blur-md text-zinc-900 border border-zinc-200/60 hover:bg-white hover:border-zinc-300"
  };

  // 如果提供了 href，渲染为 a 标签
  if (href) {
    return (
      <a 
        href={href} 
        className={`${baseStyle} ${variants[variant]} ${className}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const Badge = ({ children }: { children: React.ReactNode }) => (
  <div className="inline-flex items-center px-3 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-600 text-xs sm:text-sm font-semibold tracking-wide uppercase mb-6 sm:mb-8">
    {children}
  </div>
);

const BentoCard = ({
  title,
  description,
  icon: Icon,
  className = "",
  visual
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  className?: string;
  visual?: React.ReactNode;
}) => (
  <div className={`group relative overflow-hidden rounded-3xl bg-white/50 backdrop-blur-xl border border-white/60 p-6 sm:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] hover:shadow-xl transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    <div className="relative z-10">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white shadow-sm border border-zinc-100 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#0866FF]" />
      </div>
      <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight mb-2 text-balance">
        {title}
      </h3>
      <p className="text-sm sm:text-base text-zinc-500 leading-relaxed text-pretty font-medium">
        {description}
      </p>
    </div>
    {visual && (
      <div className="mt-6 sm:mt-8 relative w-full">
        {visual}
      </div>
    )}
  </div>
);

// -----------------------------------------------------------------------------
// Main Page
// -----------------------------------------------------------------------------

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F2F4F7] text-zinc-900 font-sans overflow-x-hidden">
      
      {/* Background Gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-20%] w-[400px] sm:w-[800px] h-[400px] sm:h-[800px] bg-blue-200/30 rounded-full blur-[80px] sm:blur-[120px] mix-blend-multiply" />
        <div className="absolute bottom-[-10%] right-[-20%] w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-indigo-200/30 rounded-full blur-[60px] sm:blur-[100px] mix-blend-multiply" />
      </div>

      {/* Navbar - 修改部分 */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center bg-[#F2F4F7]/80 backdrop-blur-lg border-b border-white/20 transition-all">
        <div className="flex items-center gap-4 z-50">
          {/* 左上角返回按钮 */}
          <a 
            href="/tools" 
            className="group flex items-center justify-center w-10 h-10 rounded-full bg-white/50 border border-zinc-200/50 hover:bg-white hover:border-zinc-300 hover:shadow-sm transition-all duration-300 active:scale-95"
            aria-label="返回"
          >
            <ChevronLeft className="w-5 h-5 text-zinc-600 group-hover:text-zinc-900 transition-colors" />
          </a>
          
          {/* 标题 */}
          <div className="font-bold text-lg tracking-tight text-zinc-900">
            FB Cookie注入器
          </div>
        </div>
      </nav>

      <div className="relative z-10 max-w-[1200px] mx-auto px-5 sm:px-8 pt-28 sm:pt-32 pb-20 sm:pb-32">
        
        {/* Hero Section */}
        <header className="flex flex-col items-center text-center max-w-2xl mx-auto mb-20 sm:mb-32">
          <Badge>via 浏览器专用 v2.0</Badge>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tighter text-zinc-900 mb-6 sm:mb-8 leading-[1.1] sm:leading-[0.95] text-balance">
            让 Cookie 管理 <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0866FF] to-[#0052CC]">
              前所未有的简单
            </span>
          </h1>
          <p className="text-base sm:text-xl text-zinc-500 font-medium leading-relaxed max-w-sm sm:max-w-xl mx-auto mb-8 sm:mb-12">
            专为手机端优化。一键注入、安全备份、防误触保护。
            让你的多账号管理体验如原生 App 般丝滑。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
            <Button variant="primary" className="group" href="https://1.584136.xyz/">
              安装脚本
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </header>

        {/* Bento Grid Features */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 auto-rows-[minmax(180px,auto)]">
          
          {/* Feature 1: Main Injector */}
          <BentoCard
            className="md:col-span-2 bg-white/60"
            title="一键注入"
            description="复制，粘贴，自动识别。只需一步，c_user 和 xs 自动解析并注入。页面秒级刷新，无缝衔接。"
            icon={Zap}
            visual={
              <div className="absolute right-[-10px] sm:right-[-20px] bottom-[-10px] sm:bottom-[-20px] w-[85%] sm:w-[300px] h-[140px] sm:h-[180px] bg-white rounded-xl sm:rounded-2xl shadow-lg border border-zinc-100 p-3 sm:p-4 rotate-[-3deg] transition-transform group-hover:rotate-0 duration-500">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-3 border-b border-zinc-100 pb-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-zinc-200" />
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-zinc-200" />
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-3/4 bg-zinc-100 rounded-full" />
                  <div className="h-2 w-1/2 bg-zinc-100 rounded-full" />
                  <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-blue-50/50 rounded-lg border border-blue-100 flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[8px] text-white">✓</div>
                    <div className="h-1.5 w-20 bg-blue-200/50 rounded-full" />
                  </div>
                </div>
              </div>
            }
          />

          {/* Feature 2: Backup */}
          <BentoCard
            className="md:row-span-2 min-h-[240px]"
            title="安全备份"
            description="一键导出 .txt。支持以时间戳和 ID 命名，让账号资产井井有条。"
            icon={Download}
            visual={
              <div className="flex flex-col gap-2 sm:gap-3 mt-2 sm:mt-4 opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-zinc-100 shadow-sm scale-95 sm:scale-100 origin-left">
                  <div className="w-8 h-8 rounded-lg bg-[#F5F5F7] flex items-center justify-center shrink-0">
                    <span className="text-[9px] font-bold text-zinc-400">TXT</span>
                  </div>
                  <div className="min-w-0">
                    <div className="h-2 w-16 bg-zinc-200 rounded-full mb-1.5" />
                    <div className="h-1.5 w-24 bg-zinc-100 rounded-full" />
                  </div>
                </div>
              </div>
            }
          />

          {/* Feature 3: Safety Lock */}
          <BentoCard
            title="防误触保护"
            description="智能拦截 Facebook 退出按钮，防止误操作导致 Cookie 失效。全方位守护你的会话安全。"
            icon={ShieldCheck}
          />

          {/* Feature 4: Mobile Native */}
          <BentoCard
            title="移动端原生体验"
            description="专为 Via 浏览器定制。支持下滑关闭、FAB 悬浮球拖拽，完美适配触摸手势。"
            icon={Smartphone}
          />

          {/* Feature 5: Watermark */}
          <BentoCard
            className="md:col-span-2"
            title="实时 ID 仪表盘"
            description="可拖拽的悬浮窗，实时显示当前登录 ID。不遮挡视线，随时掌握账号状态。"
            icon={Cookie}
            visual={
              <div className="w-full h-16 sm:h-20 flex items-end justify-end mt-2">
                <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-zinc-900/90 backdrop-blur shadow-xl text-white transform hover:scale-105 transition-transform duration-300">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-mono text-xs sm:text-sm tracking-wide">c_user: 100...892</span>
                </div>
              </div>
            }
          />

        </section>

        {/* Footer */}
        <footer className="mt-24 text-center border-t border-zinc-200/50 pt-8">
          <div className="flex flex-col items-center gap-4">
            <p className="text-zinc-500 text-xs sm:text-sm font-medium">
              Designed for Via Browser. Power in your pocket.
            </p>
            <div className="text-[10px] text-zinc-400">
              Not affiliated with Meta Platforms, Inc.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}