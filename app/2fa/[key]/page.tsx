'use client';

import React, { useState, useEffect, use, useMemo } from 'react';
import { authenticator } from 'otplib';
import Link from 'next/link';

// 辅助函数：安全地生成 Token，既能在服务端也能在客户端运行
const generateToken = (secret: string | undefined) => {
  if (!secret) return '------';
  try {
    const cleanSecret = decodeURIComponent(secret).replace(/\s/g, '');
    const t = authenticator.generate(cleanSecret);
    return `${t.slice(0, 3)} ${t.slice(3)}`;
  } catch {
    return '密钥错误';
  }
};

// 辅助函数：获取剩余时间
const getTimeLeft = () => {
  return 30 - (new Date().getSeconds() % 30);
};

export default function AppleStyleDynamic2FA({ params }: { params: Promise<{ key: string }> }) {
  // 1. 解包 Params
  const resolvedParams = use(params);
  const rawKey = resolvedParams.key;

  // 2. 同步初始化 State
  // 我们直接在初始化时计算 token，这样服务器渲染出的 HTML 里就已经包含了验证码
  // 不再需要 "加载中" 状态
  const [token, setToken] = useState(() => generateToken(rawKey));
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft());
  const [isCopied, setIsCopied] = useState(false);

  // 3. 计时器逻辑
  useEffect(() => {
    // 修正：为了防止 hydration mismatch，我们可以在 mount 后立即校准一次时间
    setTimeLeft(getTimeLeft());
    setToken(generateToken(rawKey));

    const timer = setInterval(() => {
      const newTimeLeft = getTimeLeft();
      setTimeLeft(newTimeLeft);
      
      // 当倒计时重置时（或者每秒检查），更新 Token
      // 实际上每秒检查开销很小，这样能保证 Token 绝对实时
      if (newTimeLeft === 30 || newTimeLeft === 29) {
         setToken(generateToken(rawKey));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [rawKey]);

  const handleCopy = () => {
    if (token === '密钥错误' || token.includes('-')) return;
    navigator.clipboard.writeText(token.replace(/\s/g, ''));
    setIsCopied(true);
    if (navigator.vibrate) navigator.vibrate(40);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // 4. 样式逻辑优化：不再依赖 window.innerWidth
  // 使用 SVG viewBox 实现自适应缩放
  const viewBoxSize = 340;
  const strokeWidth = 12;
  const radius = (viewBoxSize - strokeWidth) / 2; // 留出描边宽度
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeLeft / 30) * circumference;

  const ringColor =
    timeLeft <= 5 ? 'text-red-500' :
    timeLeft <= 10 ? 'text-orange-400' :
    'text-blue-500';
  
  const bgColor = timeLeft <= 5 ? 'bg-red-50' : 'bg-white/80';

  return (
    <div
      className="min-h-[100dvh] bg-[#F5F5F7] flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}
    >
      <Link
        href="/2fa"
        className="absolute left-4 top-[calc(env(safe-area-inset-top)+0.75rem)] flex items-center gap-1.5 px-4 py-2 bg-white/60 backdrop-blur-md border border-white/40 shadow-sm rounded-full text-sm font-medium text-gray-600 hover:bg-white hover:text-gray-900 active:scale-95 transition-all z-20"
      >
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        <span>主页</span>
      </Link>
      
      {/* 
         优化点：使用 CSS 变量或 Tailwind 处理响应式宽度 
         w-[min(75vw,340px)] 替代了 JS 中的 Math.min
      */}
      <div
        onClick={handleCopy}
        className={`relative flex items-center justify-center rounded-full cursor-pointer ${bgColor} shadow-[0_20px_60px_-15px_rgba(0,0,0,0.18)] touch-manipulation active:scale-[0.97] backdrop-blur-xl transition-all duration-300 aspect-square w-[min(75vw,340px)]`}
      >
        {/* 
           优化点：SVG 使用 viewBox，内容会自动缩放，无需 JS 计算半径 
        */}
        <svg 
          className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        >
          <circle
            cx="50%" cy="50%" r={radius}
            fill="none" stroke="#E5E7EB"
            strokeWidth={strokeWidth}
          />
          <circle
            cx="50%" cy="50%" r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className={`${ringColor} transition-all duration-[900ms] ease-linear drop-shadow-lg`}
            style={{ strokeDasharray: circumference, strokeDashoffset }}
            // 优化点：忽略服务端和客户端时间微小差异导致的属性不匹配警告
            suppressHydrationWarning
          />
        </svg>
        
        <div className="flex flex-col items-center z-10 select-none">
          <h2 className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-2">
            安全验证码
          </h2>
          <div 
            className={`text-5xl font-bold font-mono tracking-widest ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-gray-900'} transition-colors`}
            // 优化点：Token 在服务端生成，客户端可能因时间差跳变，忽略警告
            suppressHydrationWarning
          >
            {token}
          </div>
          <div 
            className={`mt-1 font-mono font-medium ${ringColor}`}
            suppressHydrationWarning
          >
            {timeLeft}s
          </div>
          <div className={`mt-4 text-xs font-medium absolute -bottom-10 transition-all duration-300 ${isCopied ? 'opacity-100 text-green-600' : 'opacity-0'}`}>
            已复制
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-6 w-full text-center px-8 opacity-40">
        <p className="text-[11px] font-mono text-gray-500 truncate">
          {decodeURIComponent(rawKey || '')}
        </p>
      </div>
    </div>
  );
}