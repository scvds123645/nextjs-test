// path: /app/app/page.tsx
import React from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  Star, 
  Package // 用于没有图标时的默认占位
} from 'lucide-react';
import AnnouncementModal from './AnnouncementModal';
// --- Types ---
interface AppItem {
  id: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  iconUrl?: string; // 变为可选字符串,存储图片链接
  downloadUrl: string;
}

// --- Real Data ---
const apps: AppItem[] = [
  {
    id: '1',
    name: 'Facebook',
    description: '全球流行的社交网络平台',
    category: '社交',
    rating: 4.8,
    iconUrl: 'https://www.584136.xyz/%E5%A4%B4%E5%83%8F/Facebook_icon.webp',
    downloadUrl: 'https://wwamc.lanzn.com/b0138yob6j',
  },
  {
    id: '2',
    name: 'Zoho Mail',
    description: '安全且无广告的商务电子邮件',
    category: '办公',
    rating: 4.6,
    iconUrl: 'https://www.584136.xyz/%E5%A4%B4%E5%83%8F/Zoho%20Mail_icon.webp',
    downloadUrl: 'https://wwamc.lanzn.com/irwKZ3cucvkj',
  },
  {
    id: '3',
    name: 'Via浏览器',
    description: '极简极快，体积小巧的浏览器',
    category: '工具',
    rating: 4.9,
    iconUrl: 'https://www.584136.xyz/%E5%A4%B4%E5%83%8F/Via_6.8.0.apk_icon.webp',
    downloadUrl: 'https://res.viayoo.com/v1/via-release-cn.apk',
  },
  {
    id: '4',
    name: '绿茶VPN',
    description: '网络加速与隐私保护工具',
    category: '工具',
    rating: 4.5,
    iconUrl: 'https://www.584136.xyz/%E5%A4%B4%E5%83%8F/%E7%BB%BF%E8%8C%B6VPN_icon.webp',
    downloadUrl: 'https://wwamc.lanzn.com/ijKyu3cud4kd',
  },
  {
    id: '5',
    name: '脸书白号卡网',
    description: 'Facebook 账号相关服务',
    category: '服务',
    rating: 4.4,
    iconUrl: 'https://www.584136.xyz/%E5%A4%B4%E5%83%8F/telegam@fb180.jpg',
    downloadUrl: 'https://fh10.zmfaka.cn/item/c24vp9/',
  },
  {
    id: '6',
    name: '3W+ 未180脸书账号',
    description: '大批量 Facebook 账号资源',
    category: '资源',
    rating: 4.5,
    iconUrl: undefined, // 无图标，将使用默认占位
    downloadUrl: 'https://wwamc.lanzn.com/ix0qD3cud7ri',
  },
];

export default function SoftwareStorePage() {
  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 pb-safe">
      
      {/* 首次访问弹窗公告 */}
      <AnnouncementModal />
      
      {/* --- Sticky Header --- */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="relative flex items-center h-14 px-4">
          {/* Left: Back Button */}
          <Link 
            href="/tools" 
            className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full hover:bg-gray-100 transition-colors active:scale-95"
            aria-label="返回工具页"
          >
            <ChevronLeft className="w-6 h-6 text-blue-600" />
          </Link>
          
          {/* Center: Title */}
          <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-bold">
            软件商店
          </h1>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="px-4 py-6">
        
        {/* App List */}
        <div className="space-y-1">
          {/* List Header */}
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-800">
              热门应用
            </h2>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {apps.map((app) => (
              <div 
                key={app.id} 
                className="group relative flex items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 active:scale-[0.99]"
              >
                {/* App Icon Area */}
                <div className="flex-shrink-0 w-16 h-16 mr-4 rounded-2xl overflow-hidden shadow-sm bg-gray-100 border border-gray-100">
                  {app.iconUrl ? (
                    <img 
                      src={app.iconUrl} 
                      alt={app.name} 
                      className="w-full h-full object-cover"
                      loading="lazy" 
                    />
                  ) : (
                    /* Fallback Icon for Item #9 */
                    <div className="w-full h-full bg-violet-500 flex items-center justify-center text-white">
                      <Package className="w-8 h-8" />
                    </div>
                  )}
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0 mr-2">
                  <h3 className="text-base font-bold text-slate-900 truncate">
                    {app.name}
                  </h3>
                  <p className="text-xs text-gray-500 truncate mb-1">
                    {app.description}
                  </p>
                  
                  {/* Rating / Meta */}
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                      <span>{app.category}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-400">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5" />
                      <span>{app.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Get Button (External Link) */}
                <a 
                  href={app.downloadUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-shrink-0 bg-gray-100 text-blue-600 font-bold text-xs py-1.5 px-4 rounded-full hover:bg-blue-50 active:bg-blue-100 transition-colors z-10 no-underline"
                >
                  获取
                </a>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* --- Bottom Spacer --- */}
      <div className="h-6"></div>
    </div>
  );
}