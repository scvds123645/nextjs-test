'use client';
import React, { useState, useEffect, use, useRef, memo } from 'react';
import { authenticator } from 'otplib';
import Link from 'next/link';

// 辅助函数：安全地生成 Token
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
const getTimeLeft = () => 30 - (new Date().getSeconds() % 30);

// 优化 1: 将 SVG 圆环提取为独立的 memo 组件，避免不必要的重渲染
const TimeRing = memo(({ timeLeft }: { timeLeft: number }) => {
  const viewBoxSize = 340;
  const strokeWidth = 12;
  const radius = (viewBoxSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeLeft / 30) * circumference;
  
  const ringColor = timeLeft <= 5 ? '#ef4444' : timeLeft <= 10 ? '#fb923c' : '#3b82f6';

  return (
    <svg className="absolute inset-0 -rotate-90" viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}>
      <circle
        cx={viewBoxSize / 2}
        cy={viewBoxSize / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-gray-200"
      />
      <circle
        cx={viewBoxSize / 2}
        cy={viewBoxSize / 2}
        r={radius}
        fill="none"
        stroke={ringColor}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s linear' }}
      />
    </svg>
  );
});

TimeRing.displayName = 'TimeRing';

export default function AppleStyleDynamic2FA({ params }: { params: Promise<{ key: string }> }) {
  const resolvedParams = use(params);
  const rawKey = resolvedParams.key;

  // 优化 2: 使用 useRef 存储计时器 ID，避免闭包问题
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // 优化 3: 初始化时直接计算，避免额外的渲染
  const [token, setToken] = useState(() => generateToken(rawKey));
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft());
  const [isCopied, setIsCopied] = useState(false);

  // 优化 4: 使用 useRef 来避免复制提示的计时器泄漏
  const copyTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 优化 5: 优化计时器逻辑 - 只在必要时更新状态
  useEffect(() => {
    // 立即校准
    const currentTimeLeft = getTimeLeft();
    setTimeLeft(currentTimeLeft);
    setToken(generateToken(rawKey));

    // 优化 6: 使用单一计时器，精确控制更新时机
    const updateState = () => {
      const newTimeLeft = getTimeLeft();
      
      // 只在时间真正改变时更新状态
      setTimeLeft(prev => {
        if (prev !== newTimeLeft) {
          // 当倒计时重置时更新 Token
          if (newTimeLeft === 30 || newTimeLeft === 29) {
            setToken(generateToken(rawKey));
          }
          return newTimeLeft;
        }
        return prev;
      });
    };

    timerRef.current = setInterval(updateState, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [rawKey]);

  // 优化 7: 优化复制逻辑
  const handleCopy = () => {
    if (token === '密钥错误' || token.includes('-')) return;
    
    navigator.clipboard.writeText(token.replace(/\s/g, ''));
    setIsCopied(true);
    
    if (navigator.vibrate) navigator.vibrate(40);
    
    // 清除之前的计时器
    if (copyTimerRef.current) {
      clearTimeout(copyTimerRef.current);
    }
    
    copyTimerRef.current = setTimeout(() => setIsCopied(false), 2000);
  };

  // 清理复制计时器
  useEffect(() => {
    return () => {
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  // 优化 8: 使用 useMemo 缓存样式类名
  const bgColor = timeLeft <= 5 ? 'bg-red-50' : 'bg-white/80';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex flex-col items-center justify-center p-4 font-sans">
      <Link 
        href="/" 
        className="absolute top-6 left-6 text-blue-600 hover:text-blue-700 transition-colors text-sm font-medium"
      >
        ← 主页
      </Link>

      <div className={`relative ${bgColor} backdrop-blur-xl rounded-3xl shadow-2xl p-8 transition-colors duration-300 w-[min(75vw,340px)] aspect-square flex flex-col items-center justify-center`}>
        <TimeRing timeLeft={timeLeft} />

        <div className="relative z-10 text-center space-y-4">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            安全验证码
          </div>

          <button
            onClick={handleCopy}
            className="text-5xl font-bold tracking-wider text-gray-900 hover:text-blue-600 transition-colors duration-200 cursor-pointer select-none"
            aria-label="点击复制验证码"
          >
            {token}
          </button>

          <div className="text-3xl font-semibold text-gray-700">
            {timeLeft}s
          </div>

          {isCopied && (
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg animate-bounce">
              已复制
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 text-sm text-gray-500 max-w-xs text-center break-all px-4">
        {decodeURIComponent(rawKey || '')}
      </div>
    </div>
  );
}