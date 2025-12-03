// path: /app/fb/page.tsx
import { redirect } from 'next/navigation';

export default function FacebookRedirectPage() {
  // 使用服务端重定向，立即跳转到目标链接
  redirect('/app-store');
}