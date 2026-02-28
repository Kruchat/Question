'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Moon, Sun, ShieldCheck } from 'lucide-react';

export default function Navbar() {
    const pathname = usePathname();
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        // Check initial theme
        if (document.documentElement.classList.contains('dark')) {
            setTheme('dark');
        }
    }, []);

    const toggleTheme = () => {
        if (theme === 'light') {
            document.documentElement.classList.add('dark');
            setTheme('dark');
        } else {
            document.documentElement.classList.remove('dark');
            setTheme('light');
        }
    };

    return (
        <nav className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 z-50 transition-all duration-300 transform origin-top">
            <div className="max-w-7xl mx-auto px-4 sm:px-8">
                <div className="flex justify-between h-16 sm:h-20 items-center">
                    <Link href="/" className="flex items-center gap-2.5 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-[0.6rem] sm:rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
                            <svg className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <span className="font-mitr font-medium text-[1.05rem] sm:text-xl tracking-tight text-slate-900 dark:text-white">
                            ระบบข้อสอบออนไลน์
                        </span>
                    </Link>
                    <div className="flex items-center space-x-3 sm:space-x-5">
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
                            aria-label="Toggle Dark Mode"
                        >
                            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                        </button>
                        {pathname !== '/admin' && (
                            <Link
                                href="/admin"
                                className="text-sm font-medium text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors uppercase tracking-wider flex items-center gap-1"
                            >
                                <ShieldCheck className="w-4 h-4" />
                                Admin
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
