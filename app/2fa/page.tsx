'use client';

import React, { useState, useEffect, useRef } from 'react';
// 移除静态导入: import { authenticator } from 'otplib';
import Link from 'next/link';

// 定义 authenticator 的类型接口，方便 TypeScript 推断 (可选，视具体需求而定)
type AuthenticatorType = {
  generate: (secret: string) => string;
  [key: string]: any;
};

export default function AppleStyle2FA() {
  const [secret, setSecret] = useState('');
  const [token, setToken] = useState<string>('--- ---');
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTokenCopied, setIsTokenCopied] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // 使用 useRef 存储动态加载的 authenticator 实例
  // 这样不会触发重渲染，且能在 setInterval 中即时访问
  const authenticatorRef = useRef<AuthenticatorType | null>(null);

  const formatToken = (t: string) => (t.length === 6 ? `${t.slice(0, 3)} ${t.slice(3)}` : t);

  // 优化点 1: 异步加载 otplib 库
  useEffect(() => {
    let isMounted = true;

    const loadLibrary = async () => {
      try {
        // 动态导入：Next.js 会自动将其分割为单独的 JS 文件
        const otplib = await import('otplib');
        if (isMounted) {
          authenticatorRef.current = otplib.authenticator;
        }
      } catch (error) {
        console.error('Failed to load crypto library', error);
      }
    };

    loadLibrary();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTimeLeft(30 - (now.getSeconds() % 30));

      // 优化点 2: 只有当库加载完成 (authenticatorRef.current 存在) 时才进行计算
      if (secret && secret.length > 8 && authenticatorRef.current) {
        try {
          const cleanSecret = secret.replace(/\s/g, '');
          // 使用 ref 中的实例调用 generate
          const newToken = authenticatorRef.current.generate(cleanSecret);
          setToken(formatToken(newToken));
          setIsValid(true);
        } catch {
          setToken('无效密钥');
          setIsValid(false);
        }
      } else if (!authenticatorRef.current && secret.length > 8) {
        // 库还在加载中时的临时状态（可选）
        setToken('加载中...');
        setIsValid(false);
      } else {
        setToken('--- ---');
        setIsValid(false);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [secret]);

  const handleCopyToken = () => {
    if (!isValid) return;
    navigator.clipboard.writeText(token.replace(/\s/g, ''));
    setIsTokenCopied(true);
    if (navigator.vibrate) navigator.vibrate(40);
    setTimeout(() => setIsTokenCopied(false), 2000);
  };

  const handleCopyLink = () => {
    if (!isValid) return;
    const cleanSecret = secret.replace(/\s/g, '');
    const url = `${window.location.origin}/2fa/${encodeURIComponent(cleanSecret)}`;
    navigator.clipboard.writeText(url);
    setIsLinkCopied(true);
    if (navigator.vibrate) navigator.vibrate(40);
    setTimeout(() => setIsLinkCopied(false), 2000);
  };

  const getProgressColor = () =>
    timeLeft <= 5
      ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
      : timeLeft <= 10
      ? 'bg-orange-500'
      : 'bg-blue-500';

  const getTextColor = () =>
    !isValid
      ? 'text-gray-300'
      : timeLeft <= 5
      ? 'text-red-500'
      : timeLeft <= 10
      ? 'text-orange-500'
      : 'text-blue-500';

  return (
    <div
      className="min-h-[100dvh] bg-[#F5F5F7] flex flex-col items-center justify-center p-4 md:p-6 overflow-hidden relative"
      style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <Link
        href="/tools"
        className="absolute top-[calc(env(safe-area-inset-top)+0.5rem)] left-4 flex items-center gap-1.5 px-3 py-2 bg-white/60 backdrop-blur-md border border-white/40 shadow-sm rounded-full text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white transition active:scale-95 z-20"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        <span>工具箱</span>
      </Link>
      
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl rounded-2xl p-5 md:p-8 transition-all duration-300">
        <div className="text-center mb-6">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">两步验证</h1>
        </div>
        
        <div
          onClick={handleCopyToken}
          className="relative bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center cursor-pointer transition-all active:scale-[0.97] touch-manipulation overflow-hidden"
        >
          {isValid && (
            <div className={`absolute top-3 right-4 font-mono text-sm font-bold ${getTextColor()}`}>{timeLeft}s</div>
          )}
          <div
            className={`text-4xl md:text-5xl font-bold tracking-widest font-mono z-10 transition-colors ${
              timeLeft <= 5 && isValid ? 'text-red-500 animate-pulse' : 'text-gray-900'
            }`}
          >
            {token}
          </div>
          <div
            className={`mt-3 text-xs font-medium z-10 transition-colors ${
              isTokenCopied ? 'text-green-500 scale-105' : 'text-gray-400 group-hover:text-blue-500'
            }`}
          >
            {isTokenCopied ? '已复制 ✓' : '点击复制'}
          </div>
          {isValid && (
            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gray-100">
              <div
                className={`h-full transition-all duration-1000 ease-linear ${getProgressColor()}`}
                style={{ width: `${(timeLeft / 30) * 100}%` }}
              />
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider ml-1">
            密钥
          </label>
          <input
            type="text"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="在此粘贴密钥..."
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            inputMode="text"
            className="w-full bg-gray-100/80 border-0 rounded-xl px-4 py-3 text-base text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all outline-none font-medium"
          />
        </div>
        
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isValid ? 'max-h-20 opacity-100 mt-4' : 'max-h-0 opacity-0'
          }`}
        >
          <button
            onClick={handleCopyLink}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium active:scale-95 ${
              isLinkCopied
                ? 'bg-green-500 text-white shadow-green-200'
                : 'bg-blue-500 text-white shadow-blue-200 hover:bg-blue-600'
            } shadow-lg transition-all`}
          >
            {isLinkCopied ? '链接已复制' : '复制快捷访问链接'}
          </button>
        </div>
        <div className="mt-6 text-center">
          <p className="text-[10px] text-gray-400">本地生成 · 安全可靠</p>
        </div>
      </div>
    </div>
  );
}