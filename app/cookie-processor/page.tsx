"use client";

import React, { useState, useRef } from "react";
import { 
  ArrowLeft, 
  Copy, 
  RefreshCw, 
  Trash2, 
  CheckCircle2, 
  Cookie,
  UserCog,
  FileKey
} from "lucide-react";

// 定义三种输出模式
type FormatMode = "full" | "short" | "cookie";

export default function UnifiedFormatTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [password, setPassword] = useState("qwwwww"); // 默认密码
  const [mode, setMode] = useState<FormatMode>("full");
  const [stats, setStats] = useState({ total: 0, success: 0 });
  const [isCopied, setIsCopied] = useState(false);
  
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- 核心转换逻辑 (修改后的格式) ---
  const handleConvert = () => {
    if (!input.trim()) return;

    const lines = input.split(/\r?\n/);
    let successCount = 0;

    const results = lines.map((line) => {
      const text = line.trim();
      if (!text) return null;

      // 正则提取: 匹配 c_user=... 和 xs=...
      const uidMatch = text.match(/c_user=([^;\s]+)/);
      const xsMatch = text.match(/xs=([^;\s]+)/);

      if (uidMatch && xsMatch) {
        const uid = uidMatch[1];
        const xs = xsMatch[1];
        successCount++;

        switch (mode) {
          case "full":
            return `账号${uid}密码${password}数据c_user=${uid}; xs=${xs};`;
          case "short":
            return `账号${uid}密码${password}`;
          case "cookie":
            return `c_user=${uid}; xs=${xs};`;
          default:
            return null;
        }
      }
      return null;
    });

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
    <div className="min-h-screen bg-gray-50 pb-8 font-sans text-gray-900">
      
      {/* 1. 顶部导航栏 */}
      <header className="sticky top-0 z-30 flex items-center justify-between bg-white/90 px-4 h-14 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-bold tracking-tight">账号/Cookie 格式化</h1>
        </div>
        
        {stats.success > 0 && (
          <span className="text-xs font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full border border-green-200 animate-in fade-in zoom-in">
            成功 {stats.success}
          </span>
        )}
      </header>

      <main className="p-4 space-y-4 max-w-md mx-auto">
        
        {/* 2. 设置面板 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 space-y-3">
            {/* 模式选择 */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-gray-500 ml-1">选择模式</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setMode("full")}
                  className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-lg border transition-all duration-200 ${
                    mode === "full" 
                      ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm" 
                      : "bg-white border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  }`}
                >
                  <FileKey className={`w-4 h-4 mb-1 ${mode === "full" ? "text-blue-600" : "text-gray-400"}`} />
                  <span className="text-[10px] font-bold">账号+Cookie</span>
                </button>
                <button
                  onClick={() => setMode("short")}
                  className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-lg border transition-all duration-200 ${
                    mode === "short" 
                      ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm" 
                      : "bg-white border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  }`}
                >
                  <UserCog className={`w-4 h-4 mb-1 ${mode === "short" ? "text-blue-600" : "text-gray-400"}`} />
                  <span className="text-[10px] font-bold">仅账号密码</span>
                </button>
                <button
                  onClick={() => setMode("cookie")}
                  className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-lg border transition-all duration-200 ${
                    mode === "cookie" 
                      ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm" 
                      : "bg-white border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  }`}
                >
                  <Cookie className={`w-4 h-4 mb-1 ${mode === "cookie" ? "text-blue-600" : "text-gray-400"}`} />
                  <span className="text-[10px] font-bold">纯 Cookie</span>
                </button>
              </div>
            </div>

            {/* 密码输入 - 带动画隐藏 */}
            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${mode === 'cookie' ? 'max-h-0 opacity-0' : 'max-h-16 opacity-100'}`}>
              <div className="flex items-center gap-3 py-1">
                <label htmlFor="password" className="text-sm font-bold text-gray-700 w-16 shrink-0 ml-1">
                  统一密码
                </label>
                <input
                  id="password"
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                  placeholder="设置密码..."
                />
              </div>
            </div>
        </div>

        {/* 3. 输入区域 */}
        <div className="relative group">
          <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">原始数据</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="请粘贴包含 cookie 的文本... 系统会自动提取 c_user 和 xs 字段"
            className="w-full h-32 p-3 text-xs font-mono leading-relaxed bg-white border border-gray-300 rounded-xl outline-none resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 placeholder:text-gray-400 shadow-sm"
            spellCheck={false}
          />
          {input && (
            <button
              onClick={handleClear}
              className="absolute top-8 right-2 p-1.5 bg-gray-100/80 hover:bg-gray-200 rounded-lg text-gray-500 backdrop-blur-sm"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* 4. 操作按钮 */}
        <button
          onClick={handleConvert}
          disabled={!input}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl transition-all active:scale-[0.98] shadow-md shadow-blue-200"
        >
          <RefreshCw className="h-5 w-5" />
          开始格式化
        </button>

        {/* 5. 结果输出 */}
        <div className="space-y-1.5">
             <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-gray-500">
                  转换结果
                </span>
                <button
                  onClick={handleCopy}
                  disabled={!output}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                    isCopied
                      ? "bg-green-500 text-white shadow-green-200"
                      : "bg-white border border-gray-200 text-gray-700 active:bg-gray-50"
                  } disabled:opacity-50`}
                >
                  {isCopied ? <CheckCircle2 className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {isCopied ? "已复制" : "复制"}
                </button>
             </div>
            
            <textarea
              value={output}
              readOnly
              placeholder="等待结果..."
              className={`w-full h-40 p-3 text-xs font-mono leading-relaxed rounded-xl outline-none resize-none border transition-colors duration-200 ${
                output 
                  ? "bg-blue-50/50 border-blue-200 text-gray-800 focus:ring-2 focus:ring-blue-500/30" 
                  : "bg-gray-100 border-transparent text-gray-400"
              }`}
              spellCheck={false}
              onClick={(e) => (e.target as HTMLTextAreaElement).select()}
            />
        </div>

      </main>
    </div>
  );
}