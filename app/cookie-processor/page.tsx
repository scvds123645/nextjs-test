"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Copy, 
  RefreshCw, 
  Trash2, 
  Settings2, 
  CheckCircle2, 
  Cookie,
  UserCog,
  FileKey
} from "lucide-react";

// 定义三种输出模式
type FormatMode = "full" | "short" | "cookie";

export default function UnifiedFormatTool() {
  // --- 状态管理 ---
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [password, setPassword] = useState("qwwwww"); // 默认密码
  const [mode, setMode] = useState<FormatMode>("full");
  const [stats, setStats] = useState({ total: 0, success: 0 });
  const [isCopied, setIsCopied] = useState(false);
  
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- 核心转换逻辑 ---
  const handleConvert = () => {
    if (!input.trim()) return;

    const lines = input.split(/\r?\n/);
    let successCount = 0;

    const results = lines.map((line) => {
      // 1. 基础清理
      const text = line.trim();
      if (!text) return null;

      // 2. 正则提取: 匹配 c_user=... 和 xs=...
      const uidMatch = text.match(/c_user=([^;\s]+)/);
      const xsMatch = text.match(/xs=([^;\s]+)/);

      if (uidMatch && xsMatch) {
        const uid = uidMatch[1];
        const xs = xsMatch[1];

        successCount++;

        // 3. 根据模式格式化输出
        switch (mode) {
          case "full":
            // 模式 A: uid--password--cookie
            return `${uid}--${password}--c_user=${uid}; xs=${xs};`;
          case "short":
            // 模式 B: uid--password
            return `${uid}--${password}`;
          case "cookie":
            // 模式 C (原工具2功能): c_user=uid; xs=xs;
            return `c_user=${uid}; xs=${xs};`;
          default:
            return null;
        }
      }
      return null;
    });

    // 过滤无效行
    const validResults = results.filter((r) => r !== null);
    
    setOutput(validResults.join("\n"));
    setStats({ total: lines.length, success: successCount });
    setIsCopied(false);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setStats({ total: 0, success: 0 });
    setIsCopied(false);
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setIsCopied(true);
      
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("复制失败", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10 font-sans text-gray-900">
      
      {/* 1. 顶部导航栏 */}
      <header className="sticky top-0 z-30 flex items-center justify-between bg-white/80 px-4 h-14 backdrop-blur-md border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Link 
            href="/tools" 
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
            aria-label="返回"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <h1 className="text-lg font-bold">账号/Cookie 格式化</h1>
        </div>
        
        {stats.success > 0 && (
          <div className="animate-in fade-in zoom-in duration-300">
            <span className="text-xs font-semibold text-green-700 bg-green-100 px-3 py-1 rounded-full border border-green-200">
              成功 {stats.success} 行
            </span>
          </div>
        )}
      </header>

      <main className="p-4 space-y-5 max-w-md mx-auto">
        
        {/* 2. 设置面板 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-100">
            <Settings2 className="h-4 w-4 text-gray-500" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">输出配置</span>
          </div>
          
          <div className="p-4 space-y-4">
            
            {/* 模式选择 */}
            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-700 block">选择模式</span>
              <div className="grid grid-cols-3 gap-1 p-1 bg-gray-100 rounded-lg border border-gray-200">
                <button
                  onClick={() => setMode("full")}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-md transition-all duration-200 ${
                    mode === "full" 
                      ? "bg-white text-blue-600 shadow-sm ring-1 ring-black/5" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <FileKey className="w-4 h-4 mb-1" />
                  <span className="text-[10px] font-medium">账号+Cookie</span>
                </button>
                <button
                  onClick={() => setMode("short")}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-md transition-all duration-200 ${
                    mode === "short" 
                      ? "bg-white text-blue-600 shadow-sm ring-1 ring-black/5" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <UserCog className="w-4 h-4 mb-1" />
                  <span className="text-[10px] font-medium">仅账号密码</span>
                </button>
                <button
                  onClick={() => setMode("cookie")}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-md transition-all duration-200 ${
                    mode === "cookie" 
                      ? "bg-white text-blue-600 shadow-sm ring-1 ring-black/5" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Cookie className="w-4 h-4 mb-1" />
                  <span className="text-[10px] font-medium">纯 Cookie</span>
                </button>
              </div>
            </div>

            {/* 密码输入 - 仅在非 Cookie 模式下显示 */}
            <div className={`transition-all duration-300 overflow-hidden ${mode === 'cookie' ? 'max-h-0 opacity-0' : 'max-h-20 opacity-100'}`}>
              <div className="flex items-center gap-3 pt-1">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 w-16">
                  统一密码
                </label>
                <input
                  id="password"
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="设置账号密码..."
                />
              </div>
            </div>

          </div>
        </div>

        {/* 3. 输入区域 */}
        <div className="relative group">
          <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
            原始数据
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="请粘贴包含 cookie 的文本...&#10;系统会自动提取 c_user 和 xs 字段"
            className="w-full h-32 p-3 text-xs md:text-sm font-mono leading-relaxed bg-white border border-gray-300 rounded-xl outline-none resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 placeholder:text-gray-400 shadow-sm"
            spellCheck={false}
          />
          {input && (
            <button
              onClick={handleClear}
              className="absolute top-9 right-2 p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-500 transition-colors"
              title="清空输入"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* 4. 操作按钮 */}
        <button
          onClick={handleConvert}
          disabled={!input}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-all active:scale-[0.98] shadow-md shadow-blue-200"
        >
          <RefreshCw className="h-5 w-5" />
          开始转换格式
        </button>

        {/* 5. 结果输出区域 */}
        <div className="relative space-y-2">
             <div className="flex items-center justify-between px-1">
                <span className="text-sm font-medium text-gray-700">
                  转换结果
                </span>
                
                {/* 复制按钮 */}
                <button
                  onClick={handleCopy}
                  disabled={!output}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    isCopied
                      ? "bg-green-500 text-white shadow-md shadow-green-200"
                      : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 active:bg-gray-100 shadow-sm"
                  } disabled:opacity-50 disabled:shadow-none`}
                >
                  {isCopied ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {isCopied ? "已复制" : "复制结果"}
                </button>
             </div>
            
            <div className="relative">
              <textarea
                value={output}
                readOnly
                placeholder="等待转换..."
                className={`w-full h-48 p-3 text-xs md:text-sm font-mono leading-relaxed rounded-xl outline-none resize-none border transition-colors duration-200 ${
                  output 
                    ? "bg-blue-50/50 border-blue-200 text-gray-800 focus:ring-2 focus:ring-blue-500/30" 
                    : "bg-gray-100 border-transparent text-gray-400"
                }`}
                spellCheck={false}
                onClick={(e) => (e.target as HTMLTextAreaElement).select()}
              />
              
              {!output && stats.total > 0 && stats.success === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-xs text-red-400 bg-white/80 px-2 py-1 rounded">未找到有效的 cookie 数据</span>
                </div>
              )}
            </div>
        </div>

        {/* 底部格式提示 */}
        <div className="text-center pb-4 space-y-1">
          <p className="text-[10px] text-gray-400">
            当前格式: 
            {mode === "full" && <code className="bg-gray-100 px-1 mx-1 rounded text-gray-600">uid--pass--c_user=...; xs=...;</code>}
            {mode === "short" && <code className="bg-gray-100 px-1 mx-1 rounded text-gray-600">uid--pass</code>}
            {mode === "cookie" && <code className="bg-gray-100 px-1 mx-1 rounded text-gray-600">c_user=...; xs=...;</code>}
          </p>
        </div>

      </main>
    </div>
  );
}
