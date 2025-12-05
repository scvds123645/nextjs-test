'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, CheckCircle2, Loader2 } from 'lucide-react';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload-video', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      
      if (data.success) {
        setUploadedUrl(data.url);
      } else {
        alert('上传失败: ' + data.error);
      }
    } catch (error) {
      alert('上传出错');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <header className="sticky top-0 z-30 flex items-center bg-white/90 px-4 h-14 backdrop-blur-md border-b border-gray-200">
        <Link href="/tools" className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-bold ml-4">视频上传</h1>
      </header>

      <main className="p-4 max-w-md mx-auto space-y-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full mb-4 text-sm"
          />

          {file && (
            <div className="text-sm text-gray-600 mb-4">
              文件: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white h-12 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                上传中...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                开始上传
              </>
            )}
          </button>
        </div>

        {uploadedUrl && (
          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <div className="flex items-center gap-2 text-green-700 font-bold mb-3">
              <CheckCircle2 className="w-5 h-5" />
              上传成功!
            </div>
            <div className="text-sm text-gray-600 break-all">
              {uploadedUrl}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}