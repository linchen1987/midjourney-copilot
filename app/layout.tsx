import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import CssCompile from '@/components/css-compile';
import { ThemeProvider } from '@/components/theme-provider';
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          {children}
        </ThemeProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            classNames: {
              error: 'bg-red-500 text-white',
              success: 'bg-green-500 text-white',
              warning: 'bg-yellow-500 text-white',
              info: 'bg-blue-500 text-white',
            },
          }}
        />
        <CssCompile />
      </body>
    </html>
  );
}
