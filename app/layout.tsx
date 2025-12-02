import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        
        {/* 51.la 统计代码 */}
        <script 
          charSet="UTF-8" 
          id="LA_COLLECT" 
          src="https://sdk.51.la/js-sdk-pro.min.js"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `LA.init({id:"3OCxas9dwRFL8FZ6",ck:"3OCxas9dwRFL8FZ6",autoTrack:true,hashMode:true})`
          }}
        />
      </body>
    </html>
  );
}