'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function ResultPage() {
    const router = useRouter();
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const student_name = localStorage.getItem('student_name');
        const score = localStorage.getItem('score');
        const total = localStorage.getItem('total');
        const timeUsed = localStorage.getItem('timeUsed');

        if (!score) {
            router.replace('/');
            return;
        }

        setData({ student_name, score, total, timeUsed });
    }, [router]);

    if (!data) return null;

    return (
        <div className="glass-card w-full max-w-md p-6 sm:p-10 text-center animate-fade-in my-auto shrink-0 z-10 w-full">
            <div className="relative inline-flex items-center justify-center h-24 w-24 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 mb-8">
                <div className="absolute inset-0 rounded-full border border-emerald-500/20 animate-ping opacity-50"></div>
                <CheckCircle className="h-12 w-12" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold font-mitr mb-2 text-emerald-600 dark:text-emerald-400 tracking-tight">
                เสร็จสิ้นการทำแบบทดสอบ
            </h2>
            <div className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">{data.student_name}</div>
            <p className="text-slate-500 dark:text-slate-400 mb-10">
                ทำได้ดีมาก! ระบบได้บันทึกผลสอบของคุณเรียบร้อยแล้ว
            </p>

            <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/50">
                    <div className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-2 uppercase tracking-wide">คะแนนที่ได้</div>
                    <div className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                        <span>{data.score}</span><span className="text-xl text-slate-400 font-medium">/{data.total}</span>
                    </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-700/50">
                    <div className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-2 uppercase tracking-wide">เวลาที่ใช้</div>
                    <div className="text-3xl font-bold text-slate-800 dark:text-slate-200 mt-1">
                        <span>{data.timeUsed}</span> <span className="text-lg font-medium text-slate-400">นาที</span>
                    </div>
                </div>
            </div>

            <div className="space-y-3 relative z-10 w-full">
                <button className="btn-premium w-full flex items-center justify-center gap-2 !bg-gradient-to-r !from-indigo-500 !to-purple-500 shadow-indigo-500/30 font-mitr" onClick={() => alert('ฟีเจอร์แชร์รูปเร็วๆนี้')}>
                    แชร์ผลคะแนนของฉัน
                </button>

                <Link href="/leaderboard" className="btn-premium w-full flex items-center justify-center gap-2 font-mitr">
                    <span>🏆</span> ดูสรุปคะแนนผู้เข้าสอบทั้งหมด
                </Link>

                <Link href="/" onClick={() => localStorage.clear()} className="btn-outline-premium w-full font-mitr">
                    กลับสู่หน้าหลัก
                </Link>
            </div>
        </div>
    );
}
