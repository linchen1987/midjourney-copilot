import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import CssCompile from '@/components/css-compile';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Midjourney 小白理解助手',
  description:
    'Midjourney 提示词小白理解助手，帮助用户轻松理解和使用 Midjourney 提示词，提高创作效率和灵感。提供详细解释和实用示例，让新手快速上手，享受创作乐趣。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
        <CssCompile />
      </body>
    </html>
  );
}
