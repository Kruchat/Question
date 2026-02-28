/* eslint-disable */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ExamPage() {
    const router = useRouter();
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [timeLeft, setTimeLeft] = useState<number>(1200); // 20 mins default
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        const attemptId = localStorage.getItem('attempt_id');
        if (!attemptId) {
            router.replace('/');
            return;
        }

        Promise.all([
            fetch('/api/exam/questions').then(res => res.json()),
            fetch('/api/exam/status').then(res => res.json())
        ]).then(([qs, sys]) => {
            setQuestions(qs);
            setTimeLeft((sys.timeLimit || 20) * 60);
            setLoading(false);
        });
    }, [router]);

    useEffect(() => {
        if (loading || submitting) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [loading, submitting, answers]);

    const handleSelectOption = (qId: string, value: string) => {
        setAnswers(prev => ({ ...prev, [qId]: value }));
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setShowConfirm(false);
        const attemptId = localStorage.getItem('attempt_id');

        try {
            const res = await fetch('/api/exam/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ attemptId, answers })
            });
            const data = await res.json();

            if (data.success) {
                localStorage.setItem('score', data.score.toString());
                localStorage.setItem('total', data.total.toString());
                localStorage.setItem('timeUsed', data.timeUsed.toFixed(2));
                router.replace('/result');
            } else {
                alert(data.error || 'เกิดข้อผิดพลาดในการส่งข้อสอบ');
                setSubmitting(false);
            }
        } catch (err) {
            alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
            setSubmitting(false);
        }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    if (loading) {
        return (
            <div className="text-center w-full max-w-md my-auto">
                <div className="loader-ring mx-auto mb-6"></div>
                <p className="text-slate-500 font-mitr animate-pulse">กำลังเตรียมข้อสอบ...</p>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="text-center w-full max-w-md my-auto glass-card p-10">
                <p className="text-slate-500">ไม่มีข้อสอบในระบบ</p>
                <button onClick={() => router.push('/')} className="btn-outline-premium mt-4 w-full">กลับไปหน้าแรก</button>
            </div>
        );
    }

    const currentQ = questions[currentIdx];
    const progressPercent = ((currentIdx + 1) / questions.length) * 100;

    return (
        <div className="w-full max-w-3xl animate-slide-up flex-col my-4 sm:my-auto shrink-0 z-10 w-full">
            {/* Target Progress Bar matching original UI */}
            <div className="glass-card px-4 sm:px-6 py-3 sm:py-5 mb-4 sm:mb-8 sticky top-0 z-40 flex justify-between items-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-sm sm:text-base border-b border-primary-100 dark:border-primary-900 shadow-sm rounded-none sm:rounded-2xl -mx-4 sm:mx-0">
                <div className="w-3/5 max-w-xs">
                    <div className="flex justify-between items-end mb-1">
                        <h2 className="font-mitr font-semibold text-slate-800 dark:text-slate-200 text-sm sm:text-base">
                            ข้อที่ {currentIdx + 1}/{questions.length}
                        </h2>
                    </div>
                    <div className="progress-bar-bg h-1.5 sm:h-2">
                        <div className="progress-bar-fill h-1.5 sm:h-2" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                </div>

                <div className="text-right flex flex-col items-end justify-center">
                    <div className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs font-medium uppercase tracking-wider mb-0.5">
                        เวลาที่เหลือ
                    </div>
                    <div className="font-mono text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-orange-500 leading-none">
                        {formatTime(timeLeft)}
                    </div>
                </div>
            </div>

            <div className="glass-card p-4 sm:p-8 md:p-10 mb-4 sm:mb-8 min-h-[200px] sm:min-h-[350px] flex flex-col justify-center">
                <h3 className="text-lg sm:text-2xl font-semibold mb-4 sm:mb-8 text-slate-800 dark:text-slate-100 leading-relaxed font-mitr focus:outline-none">
                    {currentIdx + 1}. {currentQ.text}
                </h3>
                <div className="space-y-2 sm:space-y-4">
                    {currentQ.options?.map((opt: string, i: number) => {
                        const isSelected = answers[currentQ.id] === opt;
                        return (
                            <label key={i} className={`exam-option-premium ${isSelected ? 'selected' : ''}`}>
                                <div className="radio-premium flex-shrink-0"></div>
                                <input
                                    type="radio"
                                    name={currentQ.id}
                                    className="hidden"
                                    checked={isSelected}
                                    onChange={() => handleSelectOption(currentQ.id, opt)}
                                />
                                <span className="text-sm sm:text-base text-slate-700 dark:text-slate-200 font-medium">{opt}</span>
                            </label>
                        );
                    })}
                </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-3 sm:gap-4">
                <button
                    disabled={currentIdx === 0}
                    onClick={() => setCurrentIdx(prev => prev - 1)}
                    className="btn-outline-premium w-full sm:w-auto"
                >
                    ข้อก่อนหน้า
                </button>

                {currentIdx === questions.length - 1 ? (
                    <button
                        onClick={() => setShowConfirm(true)}
                        className="w-full sm:w-auto px-10 py-3.5 sm:py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-[1.25rem] font-semibold tracking-wide shadow-lg shadow-emerald-500/30 transition-all duration-200 transform hover:-translate-y-0.5 active:scale-[0.97]"
                    >
                        ส่งคำตอบ
                    </button>
                ) : (
                    <button
                        onClick={() => setCurrentIdx(prev => prev + 1)}
                        className="btn-premium w-full sm:w-auto sm:px-10"
                    >
                        ถัดไป
                    </button>
                )}
            </div>

            {showConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-300">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowConfirm(false)}></div>
                    <div className="glass-card relative z-10 w-[90%] max-w-sm p-8 text-center border-none shadow-2xl animate-slide-up">
                        <div className="w-20 h-20 rounded-full bg-rose-50 dark:bg-rose-900/30 flex items-center justify-center mx-auto mb-6">
                            <div className="w-14 h-14 rounded-full bg-rose-100 dark:bg-rose-800/50 flex items-center justify-center text-rose-500 animate-pulse">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold font-mitr text-slate-800 dark:text-white mb-2">ยืนยันส่งข้อสอบ?</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">
                            คุณจะไม่สามารถกลับมาแก้ไขคำตอบได้อีก<br />กรุณาตรวจสอบให้แน่ใจ
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button onClick={() => setShowConfirm(false)} className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors w-full">ทบทวนอีกครั้ง</button>
                            <button onClick={handleSubmit} disabled={submitting} className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transform hover:-translate-y-0.5 transition-all w-full flex justify-center items-center">
                                {submitting ? <div className="loader-ring w-4 h-4 border-[2px]"></div> : 'ยืนยัน'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
