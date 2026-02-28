import type { Metadata } from 'next';
import { Sarabun, Prompt } from 'next/font/google';
import './globals.css';
import Background from '@/components/Background';
import Navbar from '@/components/Navbar';

const sarabun = Sarabun({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sarabun'
});

const prompt = Prompt({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-prompt'
});

export const metadata: Metadata = {
  title: 'ระบบทดสอบออนไลน์',
  description: 'แบบทดสอบออนไลน์ โรงเรียน',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className={`${sarabun.variable} ${prompt.variable} font-sans relative h-[100dvh] overflow-hidden flex flex-col text-slate-800 dark:text-slate-100`}>
        <Background />

        <div id="app" className="flex flex-col h-full relative z-10">
          <Navbar />
          <main className="flex-grow flex flex-col items-center py-4 sm:py-6 px-4 sm:px-4 w-full relative overflow-y-auto overflow-x-hidden safe-area-pt">
            {children}
          </main>

          <footer className="w-full text-center py-4 text-xs sm:text-[13px] text-slate-400 dark:text-slate-500 font-mitr tracking-wide bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-t border-slate-100 dark:border-slate-800/50 z-40 shrink-0">
            &copy; 2026 kruchatchawan
          </footer>
        </div>
      </body>
    </html>
  );
}
