'use client';

import React, { useState, useEffect, use } from 'react';
import { authenticator } from 'otplib';
import Link from 'next/link';

export default function AppleStyleDynamic2FA({ params }: { params: Promise<{ secret: string }> }) {
  const resolvedParams = use(params);
  const rawSecret = resolvedParams.secret;

  const [token, setToken] = useState<string>('加载中');
  const [timeLeft, setTimeLeft] = useState(30);
  const [mounted, setMounted] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    setMounted(true);

    const calculate = () => {
      const now = new Date();
      setTimeLeft(30 - (now.getSeconds() % 30));

      if (rawSecret) {
        try {
          const cleanSecret = decodeURIComponent(rawSecret).replace(/\s/g, '');
          const t = authenticator.generate(cleanSecret);
          setToken(`${t.slice(0, 3)} ${t.slice(3)}`);
        } catch {
          setToken('密钥错误');
        }
      }
    };

    calculate();
    const timer = setInterval(calculate, 1000);
    return () => clearInterval(timer);
  }, [rawSecret]);

  const handleCopy = () => {
    if (token === '密钥错误' || token === '加载中') return;

    navigator.clipboard.writeText(token.replace(/\s/g, ''));
    setIsCopied(true);
    if (navigator.vibrate) navigator.vibrate(40);

    setTimeout(() => setIsCopied(false), 2000);
  };

  /**  
   * 移动端优化点：  
   * 让圆环尺寸随屏幕变化  
   * - 小屏更紧凑  
   * - 大屏保持大视觉  
   */
  const baseSize = typeof window !== 'undefined'
    ? Math.min(window.innerWidth * 0.75, 340)
    : 300;

  const radius = baseSize / 2 - 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeLeft / 30) * circumference;

  const ringColor =
    timeLeft <= 5 ? 'text-red-500' :
    timeLeft <= 10 ? 'text-orange-400' :
    'text-blue-500';

  const bgColor = timeLeft <= 5 ? 'bg-red-50' : 'bg-white/80';

  if (!mounted) return null;

  return (
    <div
      className="min-h-[100dvh] bg-[#F5F5F7] flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}
    >
      {/* 顶部返回按钮（适配刘海屏） */}
      <Link
        href="/2fa"
        className="
          absolute 
          left-4
          top-[calc(env(safe-area-inset-top)+0.75rem)]
          flex items-center gap-1.5 px-4 py-2
          bg-white/60 backdrop-blur-md
          border border-white/40 shadow-sm 
          rounded-full text-sm font-medium text-gray-600
          hover:bg-white hover:text-gray-900
          active:scale-95 
          transition-all z-20
        "
      >
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        <span>主页</span>
      </Link>

      {/* --- 圆环主体 --- */}
      <div
        onClick={handleCopy}
        className={`
          relative
          flex items-center justify-center
          rounded-full cursor-pointer 
          ${bgColor} 
          shadow-[0_20px_60px_-15px_rgba(0,0,0,0.18)]
          touch-manipulation
          active:scale-[0.97]
          backdrop-blur-xl
          transition-all duration-300
        `}
        style={{
          width: baseSize,
          height: baseSize
        }}
      >
        {/* SVG 环形计时器 */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
        >
          <circle
            cx="50%" cy="50%" r={radius}
            fill="none" stroke="#E5E7EB"
            strokeWidth="12" strokeLinecap="round"
          />
          <circle
            cx="50%" cy="50%" r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            strokeLinecap="round"
            className={`${ringColor} transition-all duration-[900ms] ease-linear drop-shadow-lg`}
            style={{ strokeDasharray: circumference, strokeDashoffset }}
          />
        </svg>

        {/* 中心内容 */}
        <div className="flex flex-col items-center z-10 select-none">
          <h2 className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-2">
            安全验证码
          </h2>

          <div
            className={`text-5xl font-bold font-mono tracking-widest ${
              timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-gray-900'
            } transition-colors`}
          >
            {token}
          </div>

          <div className={`mt-1 font-mono font-medium ${ringColor}`}>
            {timeLeft}s
          </div>

          <div
            className={`
              mt-4 text-xs font-medium absolute -bottom-10 transition-all duration-300
              ${isCopied ? 'opacity-100 text-green-600' : 'opacity-0'}
            `}
          >
            已复制
          </div>
        </div>
      </div>

      {/* 底部密钥展示（适配小屏，自适应截断） */}
      <div className="absolute bottom-6 w-full text-center px-8 opacity-40">
        <p className="text-[11px] font-mono text-gray-500 truncate">
          {decodeURIComponent(rawSecret || '')}
        </p>
      </div>
    </div>
  );
}
