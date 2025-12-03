"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  AppWindow,
  RefreshCcw,
  Filter,
  Facebook,
  Hash,
  CopyMinus,
  Sparkles,
  ChevronRight,
} from "lucide-react";

// --- Types ---
type ToolItem = {
  path: string;
  title: string;
  desc: string;
  icon: React.ElementType;
  color: string;
  span?: string;
};

// --- Data ---
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
    span: "col-span-2",
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

// --- Utilities ---

/**
 * 触发轻微的触觉反馈
 * 仅在支持的移动设备上生效，参数 10ms 提供极其短促清晰的反馈
 */
const triggerHaptic = () => {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(10);
  }
};

// 将 Next.js Link 转换为 Motion 组件以支持动画属性
const MotionLink = motion.create(Link);

export default function ToolsPage() {
  return (
    <main className="min-h-screen w-full bg-[#050505] flex justify-center overflow-x-hidden selection:bg-white/20">
      {/* 移动端视窗限制容器 */}
      <div className="w-full max-w-md relative flex flex-col pb-10">
        
        {/* 背景装饰：环境光 (Ambient Light) - 保持静态 */}
        <div className="fixed top-[-20%] left-[-20%] w-[80%] h-[50%] bg-purple-900/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="fixed bottom-[-10%] right-[-10%] w-[60%] h-[40%] bg-blue-900/10 blur-[80px] rounded-full pointer-events-none" />

        {/* 顶部导航栏 */}
        <header className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between bg-[#050505]/60 backdrop-blur-xl border-b border-white/5">
          <motion.div
            whileTap={{ scale: 0.9 }}
            onTapStart={triggerHaptic}
          >
            <Link
              href="/"
              className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors text-zinc-300 hover:text-white flex items-center justify-center"
              aria-label="Back to Home"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
          </motion.div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium tracking-wider text-zinc-400 uppercase">
              Tools
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </header>

        {/* 主要内容区域 */}
        <div className="px-4 py-6 z-10">
          
          {/* 标题区 */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 px-2"
          >
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-200 to-zinc-500">
              效能工具箱
            </h1>
            <p className="mt-2 text-zinc-500 text-sm flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-yellow-500/80" />
              数据处理中心
            </p>
          </motion.div>

          {/* Bento Grid 布局 */}
          <div className="grid grid-cols-2 gap-3 auto-rows-auto">
            <AnimatePresence>
              {tools.map((tool, index) => (
                <ToolCard key={tool.path} tool={tool} index={index} />
              ))}
            </AnimatePresence>
          </div>

          {/* 底部装饰文案 */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-12 text-center"
          >
            <p className="text-[10px] text-zinc-700 uppercase tracking-widest font-semibold">
              Designed for Efficiency
            </p>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

// --- Sub Component: Tool Card ---
// 抽离组件以保持主逻辑清晰，并独立处理复杂的 Hover/Tap 状态
function ToolCard({ tool, index }: { tool: ToolItem; index: number }) {
  return (
    <MotionLink
      href={tool.path}
      className={`relative ${tool.span || "col-span-1"} rounded-2xl overflow-hidden`}
      // 1. Physics-Based Animations
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        delay: index * 0.05 // 瀑布流入场
      }}
      // 2. Interaction State (Hover & Tap)
      whileHover={{ 
        y: -4, 
        transition: { type: "spring", stiffness: 300, damping: 15 } 
      }}
      whileTap={{ 
        scale: 0.95,
        transition: { type: "spring", stiffness: 400, damping: 17 } // 刚性回弹，模拟真实按键
      }}
      // 3. Haptic Feedback Trigger
      onTapStart={triggerHaptic}
    >
      {/* 
         Visual Enhancements (Active State): 
         使用 motion.div 包装内部容器，以便针对 borderColor 和 backgroundColor 进行动画处理
      */}
      <motion.div
        className="relative h-full bg-[#111111]/80 backdrop-blur-md p-4 border border-white/5"
        // 动画属性：边框闪烁 & 背景加深
        whileTap={{
          borderColor: "rgba(255, 255, 255, 0.4)", // Border Flash
          backgroundColor: "rgba(20, 20, 20, 0.95)", // Inner Glow / Press Effect
        }}
        transition={{ duration: 0.1 }}
      >
        {/* 悬停时的微光效果 (仅在支持 hover 的设备显示) */}
        <div className={`absolute -right-12 -top-12 w-24 h-24 bg-gradient-to-br ${tool.color} blur-[50px] opacity-0 hover:opacity-20 transition-opacity duration-500 pointer-events-none`} />

        <div className="flex flex-col h-full justify-between gap-3 relative z-10">
          {/* 图标区 */}
          <div className="flex justify-between items-start">
            <div
              className={`p-2.5 rounded-xl bg-gradient-to-br ${tool.color} shadow-lg shadow-black/40 text-white ring-1 ring-white/10`}
            >
              <tool.icon className="w-5 h-5" strokeWidth={2.5} />
            </div>

            {/* 装饰箭头 */}
            <ChevronRight className="w-4 h-4 text-zinc-700 transition-colors" />
          </div>

          {/* 文本内容区 */}
          <div>
            <h3 className="text-base font-bold text-zinc-100 tracking-tight mb-1">
              {tool.title}
            </h3>
            <p className="text-[11px] leading-relaxed text-zinc-400 font-medium line-clamp-2">
              {tool.desc}
            </p>
          </div>
        </div>
      </motion.div>
    </MotionLink>
  );
}
