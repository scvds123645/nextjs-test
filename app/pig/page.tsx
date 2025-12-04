'use client';

import React, { useState, useEffect, useRef } from 'react';

// 定义结果类型
interface PigResult {
  id: string;
  name: string;
  emoji: string;
  description: string;
  analysis: string;
}

// 结果数据
const pigResults: PigResult[] = [
  { id: "human", name: "人类", emoji: "👤", description: "检测不出猪元素，是人类吗？", analysis: "" },
  { id: "pig", name: "猪", emoji: "🐷", description: "普通小猪", analysis: "" },
  { id: "black-pig", name: "小黑猪", emoji: "🐖", description: "小黑猪，卤出猪脚了", analysis: "" },
  { id: "wild-boar", name: "野猪", emoji: "🐗", description: "你是一只勇猛的野猪！", analysis: "" },
  { id: "zhuge-liang", name: "猪葛亮", emoji: "🐷🧠", description: "猪里最聪明的一个", analysis: "" },
  { id: "pig-stamp", name: "猪圆章", emoji: "🐷🔴", description: "《猪圈那些事》", analysis: "" },
  { id: "zombie-pig", name: "僵尸猪", emoji: "🧟🐷", description: "喜欢的食物是猪脑", analysis: "" },
  { id: "skeleton-pig", name: "骷髅猪", emoji: "💀🐷", description: "资深不死族", analysis: "" },
  { id: "pig-human", name: "猪人", emoji: "🐷👤", description: "你是猪还是人？", analysis: "" },
  { id: "demon-pig", name: "恶魔猪", emoji: "😈🐷", description: "满肚子坏心眼", analysis: "" },
  { id: "heaven-pig", name: "天堂猪", emoji: "😇🐷", description: "似了喵~", analysis: "" },
  { id: "explosive-pig", name: "爆破小猪", emoji: "💣🐷", description: "我跟你爆了！", analysis: "" },
  { id: "black-white-pig", name: "黑白猪", emoji: "⚫⚪🐷", description: "串子", analysis: "" },
  { id: "pork-skewer", name: "猪肉串", emoji: "🍢", description: "真正的串子", analysis: "" },
  { id: "magic-pig", name: "魔法少猪", emoji: "🪄🐷", description: "马猪烧酒", analysis: "" },
  { id: "mechanical-pig", name: "机械猪", emoji: "🤖🐷", description: "人机", analysis: "" },
  { id: "pig-ball", name: "猪猪球", emoji: "🏀🐷", description: "滚了", analysis: "" },
  { id: "doll-pig", name: "玩偶猪", emoji: "🧸🐷", description: "fufu小猪", analysis: "" },
  { id: "soul-pig", name: "灵魂猪", emoji: "👻🐷", description: "从冥界归来的猪", analysis: "" },
  { id: "crystal-pig", name: "水晶猪", emoji: "💎🐷", description: "珍贵又脆弱的小猪", analysis: "" },
  { id: "snow-pig", name: "雪猪", emoji: "❄️🐷", description: "洁白的雪猪", analysis: "" },
  { id: "pig-cat", name: "猪咪", emoji: "🐷🐱", description: "你是一只可爱的猪咪！", analysis: "" }
];

export default function PigTestPage() {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [hasTried, setHasTried] = useState(false);
  const [result, setResult] = useState<PigResult | null>(null);
  const [showResultAnimation, setShowResultAnimation] = useState(false);
  
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  
  // 圆环参数
  const radius = 85;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const requiredHoldTime = 3000;

  // 初始化：检查本地存储
  useEffect(() => {
    try {
      const savedResult = localStorage.getItem('pigTestResult');
      if (savedResult) {
        setResult(JSON.parse(savedResult));
        // 【关键修复】读取到结果时，必须直接显示动画，否则默认为 opacity-0
        setShowResultAnimation(true);
      }
    } catch (error) {
      console.error('读取本地存储失败:', error);
      localStorage.removeItem('pigTestResult');
    }
  }, []);

  // 播放音效
  const playSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      
      const audioCtx = new AudioContext();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime); 
      oscillator.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); 
      oscillator.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2); 
      
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      
      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.3);
    } catch (error) {
      console.error('播放音效失败:', error);
    }
  };

  // 生成结果
  const generateResult = () => {
    playSound();
    const randomIndex = Math.floor(Math.random() * pigResults.length);
    const newResult = pigResults[randomIndex];
    
    localStorage.setItem('pigTestResult', JSON.stringify(newResult));
    setResult(newResult);
    
    // 触发结果动画
    setShowResultAnimation(false);
    setTimeout(() => setShowResultAnimation(true), 10);
  };

  // 处理开始按压
  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (result) return;
    
    setIsHolding(true);
    setHasTried(true);
    startTimeRef.current = Date.now();

    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

    progressIntervalRef.current = setInterval(() => {
      const elapsedTime = Date.now() - startTimeRef.current;
      const newProgress = Math.min((elapsedTime / requiredHoldTime) * 100, 100);
      
      setProgress(newProgress);

      if (newProgress >= 100) {
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        setIsHolding(false);
        generateResult();
      }
    }, 30);
  };

  // 处理结束按压
  const handleEnd = () => {
    if (result) return;

    setIsHolding(false);
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    
    if (progress < 100) {
      setProgress(0);
    }
  };

  // 全局松开事件监听
  useEffect(() => {
    const globalEnd = () => {
      if (isHolding) {
        handleEnd();
      }
    };

    window.addEventListener('mouseup', globalEnd);
    window.addEventListener('touchend', globalEnd);
    window.addEventListener('touchcancel', globalEnd);

    return () => {
      window.removeEventListener('mouseup', globalEnd);
      window.removeEventListener('touchend', globalEnd);
      window.removeEventListener('touchcancel', globalEnd);
    };
  }, [isHolding, result, progress]);

  // 获取显示的提示文本
  const getInstructionText = () => {
    if (isHolding) return '正在提取猪元素...';
    if (hasTried) return '将手指放到屏幕中间区域，长按汲取猪元素';
    return '长按屏幕中间区域，看看你是什么猪！';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#F5F5F5] select-none touch-none">
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .float-animation {
          animation: float 3s ease-in-out infinite;
        }
        .progress-ring-circle {
          transition: stroke-dashoffset 0.1s linear;
          transform: rotate(-90deg);
          transform-origin: 50% 50%;
        }
        .text-shadow-lg {
          text-shadow: 0 4px 8px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08);
        }
      `}</style>

      <div className="container max-w-md mx-auto text-center">
        {/* 标题 */}
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#FFB6C1] text-shadow-lg">
          测测你是不是猪 <span className="text-[#FF69B4]">🐷</span>
        </h1>

        {/* 主内容区 */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8 transform transition-all duration-300 hover:shadow-xl">
          
          {!result ? (
            /* 测试区域 */
            <div 
              className={`mb-6 transition-transform duration-200 ${isHolding ? 'scale-105' : ''}`}
            >
              <div 
                className="relative w-[200px] h-[200px] mx-auto cursor-pointer"
                onMouseDown={handleStart}
                onTouchStart={handleStart}
                onMouseUp={handleEnd}
                onTouchEnd={handleEnd}
              >
                {/* 圆形进度条 */}
                <svg className="transform -rotate-90 w-full h-full" width="200" height="200">
                  <circle
                    className="text-gray-200"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="100"
                    cy="100"
                  />
                  <circle
                    className="text-[#FFB6C1] progress-ring-circle"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="100"
                    cy="100"
                    style={{
                      strokeDasharray: circumference,
                      strokeDashoffset: strokeDashoffset
                    }}
                  />
                </svg>

                {/* 中心内容 */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                  {isHolding || progress > 0 ? (
                    <span className="text-2xl font-bold text-[#FFB6C1]">
                      {Math.round(progress)}%
                    </span>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="text-5xl mb-2">👇</div>
                      <p className="text-lg text-gray-600">长按这里测试</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 提示文字 - 动态变化 */}
              <p className="text-gray-600 mt-6 h-6 transition-all duration-300">
                {getInstructionText()}
              </p>
            </div>
          ) : (
            /* 结果区域 */
            <div 
              className={`transition-all duration-500 ease-out transform ${
                showResultAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="bg-[#FFB6C1]/10 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[16rem] mb-6">
                <img 
                  src={`/image/${result.id}.png`} 
                  alt={result.name}
                  className="w-24 h-24 mb-4 float-animation object-contain"
                  onError={(e) => {
                    e.currentTarget.src = '/image/pig.png';
                  }}
                />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{result.name}</h2>
                <p className="text-gray-600">{result.description}</p>
              </div>

              <p className="text-gray-500 text-sm mt-4">
                提示：结果已保存，刷新不会改变哦！
              </p>
            </div>
          )}
        </div>

        {/* 页脚 */}
        <footer className="text-gray-500 text-sm">
          <p>作者：nanan <span className="text-[#FFB6C1]">🐽</span></p>
        </footer>
      </div>
    </div>
  );
}
