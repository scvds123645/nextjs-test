'use client';

import { useState } from 'react';

export default function PasswordFilter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const filterPasswords = (text: string) => {
    if (!text.trim()) {
      setOutput('');
      return;
    }

    // 按行分割密码
    const lines = text.split('\n');
    
    // 过滤掉少于6位数字的密码
    const filtered = lines.filter(line => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return false;
      
      // 提取所有数字
      const digits = trimmedLine.match(/\d/g);
      const digitCount = digits ? digits.length : 0;
      
      // 保留至少6位数字的密码
      return digitCount >= 6;
    });

    setOutput(filtered.join('\n'));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);
    filterPasswords(value);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  const getStats = () => {
    const inputLines = input.split('\n').filter(l => l.trim()).length;
    const outputLines = output.split('\n').filter(l => l.trim()).length;
    const filtered = inputLines - outputLines;
    return { inputLines, outputLines, filtered };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              密码数字过滤器
            </h1>
            <p className="text-gray-600">
              自动过滤少于6位数字的密码
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* 输入区域 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-lg font-semibold text-gray-700">
                  输入密码列表
                </label>
                <span className="text-sm text-gray-500">
                  {stats.inputLines} 行
                </span>
              </div>
              <textarea
                value={input}
                onChange={handleInputChange}
                placeholder="每行一个密码...&#10;例如:&#10;00betabp05&#10;1111&#10;password123456"
                className="w-full h-96 p-4 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all resize-none font-mono text-sm"
              />
            </div>

            {/* 输出区域 */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-lg font-semibold text-gray-700">
                  过滤后结果
                </label>
                <span className="text-sm text-gray-500">
                  {stats.outputLines} 行
                </span>
              </div>
              <textarea
                value={output}
                readOnly
                placeholder="过滤后的密码将显示在这里..."
                className="w-full h-96 p-4 border-2 border-green-300 bg-green-50 rounded-lg font-mono text-sm resize-none"
              />
            </div>
          </div>

          {/* 统计信息 */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-indigo-600">
                  {stats.inputLines}
                </div>
                <div className="text-sm text-gray-600">输入总数</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {stats.outputLines}
                </div>
                <div className="text-sm text-gray-600">保留数量</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {stats.filtered}
                </div>
                <div className="text-sm text-gray-600">已过滤</div>
              </div>
            </div>
          </div>

          {/* 按钮组 */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleCopy}
              disabled={!output}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              复制结果
            </button>
            <button
              onClick={handleClear}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              清空
            </button>
          </div>

          {/* 说明 */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">使用说明:</h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>每行输入一个密码</li>
              <li>工具会自动过滤掉数字少于6位的密码</li>
              <li>例如: "1111" 会被过滤掉,而 "00betabp05" 会保留</li>
              <li>数字可以在密码的任何位置,只要总数达到6位即可</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}