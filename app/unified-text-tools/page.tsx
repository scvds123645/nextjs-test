"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ArrowLeft, Trash2, Copy, CheckCircle2, Sparkles, FileText, Search, RotateCcw } from 'lucide-react';

// ==================== 类型定义 ====================
type ToolType = 'deduplicate' | 'extract';

interface Stats {
  original: number;
  unique: number;
  removed: number;
}

// ==================== 可复用组件 ====================

// 1. 分段控制器组件 - 优化触摸体验
const SegmentedControl: React.FC<{
  value: ToolType;
  onChange: (value: ToolType) => void;
}> = ({ value, onChange }) => {
  return (
    <div className="bg-gray-200/50 p-1 rounded-2xl flex gap-1 touch-manipulation">
      <button
        onClick={() => onChange('deduplicate')}
        className={`flex-1 px-4 py-3 rounded-xl font-semibold text-base transition-all duration-200 active:scale-95 ${
          value === 'deduplicate'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'bg-transparent text-gray-500'
        }`}
      >
        文本去重
      </button>
      <button
        onClick={() => onChange('extract')}
        className={`flex-1 px-4 py-3 rounded-xl font-semibold text-base transition-all duration-200 active:scale-95 ${
          value === 'extract'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'bg-transparent text-gray-500'
        }`}
      >
        号码提取
      </button>
    </div>
  );
};

// 2. 输入框组件 - 优化移动端输入体验
const TextInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  placeholder: string;
  label: string;
  lineCount?: number;
}> = ({ value, onChange, onClear, placeholder, label, lineCount }) => {
  return (
    <section className="flex flex-col gap-2">
      <div className="flex justify-between items-end px-1">
        <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
          <FileText className="w-4 h-4" /> {label}
        </label>
        {lineCount !== undefined && (
          <span className="text-xs text-gray-400">
            {lineCount} 行
          </span>
        )}
      </div>
      
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-40 p-4 rounded-2xl border border-gray-200 bg-white text-base leading-relaxed outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none shadow-sm placeholder:text-gray-300 transition-colors touch-manipulation"
          style={{ fontSize: '16px' }} // 防止 iOS Safari 自动缩放
        />
        {value && (
          <button 
            onClick={onClear}
            className="absolute top-2 right-2 p-2 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-colors touch-manipulation"
            aria-label="清空输入"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </section>
  );
};

// 3. 统计卡片组件
const StatsCard: React.FC<{
  label: string;
  value: number;
  variant?: 'default' | 'danger' | 'success';
}> = ({ label, value, variant = 'default' }) => {
  const styles = {
    default: 'bg-white border-gray-100 text-gray-700',
    danger: 'bg-red-50 border-red-100 text-red-600',
    success: 'bg-green-50 border-green-100 text-green-600',
  };
  
  const labelStyles = {
    default: 'text-gray-400',
    danger: 'text-red-400',
    success: 'text-green-500',
  };

  return (
    <div className={`${styles[variant]} p-3 rounded-xl border shadow-sm text-center`}>
      <div className={`text-xs ${labelStyles[variant]} mb-1`}>{label}</div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
};

// 4. 复制按钮组件 - 增大触摸区域
const CopyButton: React.FC<{
  isCopied: boolean;
  onClick: () => void;
  disabled?: boolean;
}> = ({ isCopied, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`min-h-[44px] px-4 flex items-center gap-2 rounded-lg shadow-sm text-xs font-bold transition-all active:scale-95 touch-manipulation ${
        isCopied 
          ? 'bg-green-500 text-white border-transparent shadow-green-200' 
          : 'bg-white text-gray-700 border border-gray-200 active:bg-gray-100'
      }`}
      aria-label={isCopied ? '已复制' : '复制到剪贴板'}
    >
      {isCopied ? (
        <>
          <CheckCircle2 className="w-4 h-4" /> 已复制
        </>
      ) : (
        <>
          <Copy className="w-4 h-4" /> 复制
        </>
      )}
    </button>
  );
};

// 5. 操作按钮组件 - 优化触摸反馈
const ActionButton: React.FC<{
  onClick: () => void;
  disabled?: boolean;
  icon: React.ReactNode;
  text: string;
  variant?: 'primary' | 'secondary';
}> = ({ onClick, disabled, icon, text, variant = 'primary' }) => {
  const styles = variant === 'primary'
    ? 'bg-blue-500 text-white shadow-md shadow-blue-200/50 active:bg-blue-600'
    : 'bg-white border border-gray-300 text-gray-700 active:bg-gray-100 shadow-sm';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full min-h-[48px] flex items-center justify-center gap-2 rounded-2xl font-semibold text-base transition-all active:scale-[0.97] disabled:opacity-50 disabled:shadow-none disabled:active:scale-100 touch-manipulation ${styles}`}
    >
      {icon}
      {text}
    </button>
  );
};

// ==================== 主组件 ====================
export default function UnifiedTextToolsPage() {
  // 工具切换
  const [activeTool, setActiveTool] = useState<ToolType>('deduplicate');
  
  // 去重工具状态
  const [dedupeInput, setDedupeInput] = useState('');
  const [dedupeOutput, setDedupeOutput] = useState('');
  const [dedupeStats, setDedupeStats] = useState<Stats>({ original: 0, unique: 0, removed: 0 });
  const [dedupeProcessed, setDedupeProcessed] = useState(false);
  const [dedupeCopied, setDedupeCopied] = useState(false);
  
  // 提取工具状态
  const [extractInput, setExtractInput] = useState('');
  const [extractResults, setExtractResults] = useState<string[]>([]);
  const [extractSearched, setExtractSearched] = useState(false);
  const [extractCopied, setExtractCopied] = useState(false);
  
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 防止页面滚动穿透（iOS Safari）
  useEffect(() => {
    document.body.style.overflow = 'auto';
    document.body.style.position = 'relative';
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
    };
  }, []);

  // ==================== 去重工具逻辑 ====================
  const handleDeduplicate = useCallback(() => {
    if (!dedupeInput.trim()) return;

    const lines = dedupeInput.split('\n');
    const processedLines = lines
      .map(line => line.trim())
      .filter(line => line !== '');

    const uniqueSet = new Set(processedLines);
    const uniqueLines = Array.from(uniqueSet);

    setDedupeOutput(uniqueLines.join('\n'));
    setDedupeStats({
      original: lines.length,
      unique: uniqueLines.length,
      removed: lines.length - uniqueLines.length
    });
    setDedupeProcessed(true);
    setDedupeCopied(false);
    
    // 处理完成后滚动到结果区域
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  }, [dedupeInput]);

  const handleDedupeClear = () => {
    setDedupeInput('');
    setDedupeOutput('');
    setDedupeStats({ original: 0, unique: 0, removed: 0 });
    setDedupeProcessed(false);
    setDedupeCopied(false);
  };

  const handleDedupeCopy = async () => {
    if (!dedupeOutput) return;
    try {
      await navigator.clipboard.writeText(dedupeOutput);
      setDedupeCopied(true);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => setDedupeCopied(false), 2000);
    } catch (err) {
      console.error('复制失败: ', err);
    }
  };

  // ==================== 提取工具逻辑 ====================
  const handleExtract = () => {
    if (!extractInput.trim()) {
      setExtractResults([]);
      setExtractSearched(true);
      return;
    }

    const regex = /(?<!\d)\d{14}(?!\d)/g;
    const matches = extractInput.match(regex) || [];
    const uniqueResults = Array.from(new Set(matches));
    
    setExtractResults(uniqueResults);
    setExtractSearched(true);
    setExtractCopied(false);
    
    // 处理完成后滚动到结果区域
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  const handleExtractClear = () => {
    setExtractInput('');
    setExtractResults([]);
    setExtractSearched(false);
    setExtractCopied(false);
  };

  const handleExtractCopy = async () => {
    if (extractResults.length === 0) return;
    try {
      const textToCopy = extractResults.join('\n');
      await navigator.clipboard.writeText(textToCopy);
      setExtractCopied(true);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => setExtractCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // ==================== 工具切换处理 ====================
  const handleToolChange = (tool: ToolType) => {
    setActiveTool(tool);
    // 切换时滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50/30 flex flex-col font-sans text-gray-900 pb-20 safe-area-inset">
      
      {/* 顶部导航栏 - 增加安全区域支持 */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 h-14 flex items-center justify-between shadow-sm safe-area-top">
        <button 
          onClick={() => window.history.back()}
          className="p-2 -ml-2 rounded-full active:bg-gray-200 transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="返回"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-base sm:text-lg font-bold text-gray-800 absolute left-1/2 -translate-x-1/2">
          文本处理工具
        </h1>
        <div className="w-11" />
      </header>

      {/* 主内容区 - 优化移动端间距 */}
      <main className="flex-1 px-4 py-4 flex flex-col gap-4 max-w-2xl mx-auto w-full">
        
        {/* 工具切换器 */}
        <SegmentedControl value={activeTool} onChange={handleToolChange} />

        {/* 去重工具 */}
        {activeTool === 'deduplicate' && (
          <div className="animate-in fade-in slide-in-from-right-2 duration-300">
            <TextInput
              value={dedupeInput}
              onChange={setDedupeInput}
              onClear={handleDedupeClear}
              placeholder="请粘贴需要去重的列表...&#10;自动去除首尾空格及空行"
              label="原始文本"
              lineCount={dedupeInput ? dedupeInput.split('\n').length : 0}
            />

            <div className="mt-4">
              <ActionButton
                onClick={handleDeduplicate}
                disabled={!dedupeInput}
                icon={<Sparkles className="w-5 h-5" />}
                text="开始去重"
              />
            </div>

            {dedupeProcessed && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 space-y-4 mt-4">
                <div className="grid grid-cols-3 gap-2">
                  <StatsCard label="原行数" value={dedupeStats.original} />
                  <StatsCard label="已移除" value={dedupeStats.removed} variant="danger" />
                  <StatsCard label="最终结果" value={dedupeStats.unique} variant="success" />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-600 px-1">
                    去重结果
                  </label>
                  
                  <div className="relative group">
                    <textarea
                      readOnly
                      value={dedupeOutput}
                      placeholder="结果将显示在这里..."
                      className="w-full h-48 p-4 rounded-2xl border border-gray-200 bg-gray-50 text-base leading-relaxed outline-none resize-none text-gray-800 transition-colors touch-manipulation"
                      style={{ fontSize: '16px' }}
                      onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                    />
                    
                    <div className="absolute bottom-3 right-3">
                      <CopyButton
                        isCopied={dedupeCopied}
                        onClick={handleDedupeCopy}
                        disabled={!dedupeOutput}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 提取工具 */}
        {activeTool === 'extract' && (
          <div className="animate-in fade-in slide-in-from-left-2 duration-300">
            <TextInput
              value={extractInput}
              onChange={setExtractInput}
              onClear={handleExtractClear}
              placeholder="请粘贴包含14位数字的多行文本...&#10;例如：&#10;订单号：20231012123456 已发货&#10;ID: 20231012987654"
              label="原始文本"
              lineCount={extractInput ? extractInput.split('\n').length : 0}
            />

            <div className="grid grid-cols-2 gap-3 mt-4">
              <ActionButton
                onClick={handleExtract}
                icon={<Search size={18} />}
                text="提取号码"
              />
              <ActionButton
                onClick={handleExtractClear}
                icon={<RotateCcw size={18} />}
                text="清空"
                variant="secondary"
              />
            </div>

            {extractSearched && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 mt-4">
                <div className="flex items-center justify-between mb-2 px-1">
                  <h2 className="text-sm font-semibold text-gray-600">
                    提取结果 (共 {extractResults.length} 个)
                  </h2>
                  {extractResults.length > 0 && (
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      已去重
                    </span>
                  )}
                </div>

                {extractResults.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-h-[50vh] overflow-y-auto overscroll-contain -webkit-overflow-scrolling-touch">
                      <ul className="divide-y divide-gray-100">
                        {extractResults.map((num, index) => (
                          <li 
                            key={`${num}-${index}`} 
                            className="flex items-center p-3 active:bg-gray-50 transition-colors touch-manipulation min-h-[52px]"
                          >
                            <span className="font-mono text-gray-800 tracking-wider text-base select-all">
                              {num}
                            </span>
                            <span className="ml-auto text-xs text-gray-400 font-mono">
                              #{index + 1}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={handleExtractCopy}
                      disabled={extractCopied}
                      className={`w-full min-h-[52px] flex items-center justify-center gap-2 rounded-2xl font-bold text-base shadow-md transition-all active:scale-[0.97] touch-manipulation ${
                        extractCopied 
                          ? "bg-green-500 text-white" 
                          : "bg-gray-900 text-white active:bg-gray-800"
                      }`}
                    >
                      {extractCopied ? (
                        <>
                          <CheckCircle2 size={20} />
                          复制成功
                        </>
                      ) : (
                        <>
                          <Copy size={20} />
                          一键复制所有结果
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 flex flex-col items-center justify-center text-center text-gray-400 gap-2">
                    <Search size={48} className="text-gray-200" />
                    <p className="text-sm">未找到符合条件的 14 位数字</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}