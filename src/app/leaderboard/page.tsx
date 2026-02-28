'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function LeaderboardPage() {
    const [board, setBoard] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/exam/leaderboard')
            .then(res => res.json())
            .then(data => {
                setBoard(data);
                setLoading(false);
            });
    }, []);

    return (
        <div className="w-full max-w-4xl animate-fade-in flex flex-col z-10 w-full">
            <div className="glass-card mb-6 overflow-hidden">
                <div className="bg-gradient-to-r from-primary-600 to-indigo-600 p-8 text-white relative overflow-hidden rounded-t-3xl">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h2 className="text-3xl font-bold font-mitr mb-2 flex items-center gap-3">
                                🏆 กระดานคะแนน
                                <div className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-pulse shadow-[0_0_10px_rgba(251,113,133,0.8)]"></div>
                            </h2>
                            <p className="text-primary-100 text-sm">การจัดอันดับคะแนนสูงสุด อัปเดตแบบเรียลไทม์</p>
                        </div>
                        <Link href="/" className="px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-white font-medium transition-colors text-sm border border-white/20">
                            ← กลับหน้าหลัก
                        </Link>
                    </div>
                </div>

                {/* Custom Podium can be implemented here exactly like the plain JS version, but omitted for brevity in demo. We will show standard list. */}

                <div className="p-0 overflow-x-auto max-w-4xl mx-auto w-full">
                    <table className="w-full text-left border-collapse min-w-[500px]">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">
                                <th className="p-4 border-b border-slate-200 dark:border-slate-700/50 w-20 text-center">ลำดับ</th>
                                <th className="p-4 border-b border-slate-200 dark:border-slate-700/50">ชื่อ-นามสกุล</th>
                                <th className="p-4 border-b border-slate-200 dark:border-slate-700/50 text-right w-24">คะแนน</th>
                                <th className="p-4 border-b border-slate-200 dark:border-slate-700/50 text-right w-24">เวลา(นาที)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-base">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="p-10 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <div className="loader-ring w-8 h-8"></div>กำลังโหลดข้อมูล...
                                        </div>
                                    </td>
                                </tr>
                            ) : board.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-10 text-center text-slate-500">ยังไม่มีข้อมูลคะแนนสอบ</td>
                                </tr>
                            ) : (
                                board.map((row, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                                        <td className="p-4 text-center font-bold text-slate-400">{i + 1}</td>
                                        <td className="p-4 font-medium">{row.name}</td>
                                        <td className="p-4 text-right font-bold text-primary-600">{row.score}</td>
                                        <td className="p-4 text-right text-slate-500">{row.timeUsed?.toFixed(2)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
