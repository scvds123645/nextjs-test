'use client';

import React, { useState } from 'react';
import { FileText, Download, Copy, Check } from 'lucide-react';

export default function DomainExtractor() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const extractDomains = (text: string) => {
    // ========== 自定义配置区域 ==========
    // 定义起始和结束标记
    const startMarker = '00two.shop';
    const endMarker = 'zxcc.lol';
    
    // 需要过滤掉的域名列表（这些域名不会出现在最终结果中）
    const FILTERED_DOMAINS = [
      'mail-imap.yopmail.com',
	  'fenart.site',
      // 在这里添加更多需要过滤的域名
      // 'example.com',
      // 'test.com',
    ];
    // ===================================
    
    // 找到起始和结束位置
    const startIndex = text.indexOf(startMarker);
    const endIndex = text.indexOf(endMarker);
    
    if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
      return JSON.stringify(['yopmail.com'], null, 2);
    }
    
    // 提取指定范围内的文本（包含结束标记）
    const rangeText = text.substring(startIndex, endIndex + endMarker.length);
    
    // 匹配域名的正则表达式
    const domainRegex = /\b(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}\b/g;
    
    // 提取所有域名
    const domains = rangeText.match(domainRegex) || [];
    
    // 去重并保持原始顺序
    const uniqueDomains = [...new Set(domains)];
    
    // 过滤掉不需要的域名（包括 yopmail.com 和自定义过滤列表）
    const filteredDomains = uniqueDomains.filter(d => 
      d !== 'yopmail.com' && !FILTERED_DOMAINS.includes(d)
    );
    
    // 将 yopmail.com 放在第一个位置
    const finalDomains = ['yopmail.com', ...filteredDomains];
    
    // 转换为 JSON 数组格式
    return JSON.stringify(finalDomains, null, 2);
  };

  const handleConvert = () => {
    const result = extractDomains(input);
    setOutput(result);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'domains.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">域名提取器</h1>
          <p className="text-gray-600">从文本中提取 00two.shop 到 zxcc.lol 范围内的域名</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 输入区域 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                输入文本
              </h2>
              <span className="text-sm text-gray-500">
                {input.length} 字符
              </span>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="粘贴包含域名的文本（需包含 00two.shop 和 zxcc.lol 标记）..."
              className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
            />
            <button
              onClick={handleConvert}
              disabled={!input.trim()}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              转换为 JSON 格式
            </button>
          </div>

          {/* 输出区域 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                JSON 输出
              </h2>
              {output && (
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        已复制
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        复制
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm"
                  >
                    <Download className="w-4 h-4" />
                    下载
                  </button>
                </div>
              )}
            </div>
            <div className="relative">
              <pre className="w-full h-96 p-4 border border-gray-300 rounded-lg bg-gray-50 overflow-auto font-mono text-sm">
                {output || '转换后的 JSON 格式将显示在这里...'}
              </pre>
            </div>
            {output && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  ✓ 成功提取 <strong>{JSON.parse(output).length}</strong> 个唯一域名
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 说明 */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">使用说明</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">1.</span>
              <span>将包含域名的文本粘贴到左侧输入框（文本中需包含 00two.shop 和 zxcc.lol）</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">2.</span>
              <span>点击"转换为 JSON 格式"按钮</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">3.</span>
              <span>自动提取从 00two.shop 到 zxcc.lol 范围内的所有域名并去重</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">4.</span>
              <span>使用"复制"或"下载"按钮保存结果</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">5.</span>
              <span>已自动过滤 mail-imap.yopmail.com 等不需要的域名</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}