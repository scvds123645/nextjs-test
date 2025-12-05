import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: '未找到文件' },
        { status: 400 }
      );
    }

    // 上传到 Vercel Blob
    const blob = await put(
      `头像/${file.name}`,
      file,
      {
        access: 'public',
        addRandomSuffix: false // 使用原始文件名
      }
    );

    return NextResponse.json({
      success: true,
      url: blob.url
    });
    
  } catch (error) {
    console.error('上传失败:', error);
    return NextResponse.json(
      { error: '上传失败' },
      { status: 500 }
    );
  }
}