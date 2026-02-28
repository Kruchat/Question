'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/exam/status')
      .then(res => res.json())
      .then(data => {
        setStatus(data.status);
      })
      .catch(err => {
        console.error(err);
        setStatus('error');
      });
  }, []);

  const handleStartExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (!/^[ก-๙\s]+$/.test(name)) {
      setError('กรุณากรอกชื่อด้วยภาษาไทยเท่านั้น');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/exam/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, group: '' })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Save session locally
        localStorage.setItem('student_name', name);
        localStorage.setItem('attempt_id', data.attemptId);
        localStorage.setItem('start_time', data.startTime.toString());

        router.push('/exam');
      } else {
        setError(data.error || 'เกิดข้อผิดพลาด กรุณาลองใหม่');
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ');
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="text-center w-full max-w-md my-auto">
        <div className="loader-ring mx-auto mb-6"></div>
        <p className="text-slate-500 font-mitr animate-pulse">กำลังโหลดข้อมูลระบบ...</p>
      </div>
    );
  }

  return (
    <div className="glass-card w-full max-w-[26rem] p-6 sm:p-10 animate-fade-in my-auto shrink-0 z-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-br from-primary-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800 shadow-inner mb-6 border border-slate-100 dark:border-slate-700">
          <svg className="h-10 w-10 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-mitr mb-3 text-gradient">แบบทดสอบออนไลน์</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
          งานประกันคุณภาพภายในและภายนอก ปีการศึกษา 2569 <br />จัดทำโดย ผอ.ศิริพร ดาระสุวรรณ์
        </p>
      </div>

      {status !== 'open' ? (
        <div className="text-center p-6 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-2xl mb-6">
          <p className="text-rose-600 dark:text-rose-400 font-semibold mb-2">⛔ ขณะนี้ระบบปิดรับการทดสอบ</p>
          <p className="text-sm text-rose-500/80">กรุณารอให้แอดมินเปิดระบบ</p>
        </div>
      ) : (
        <form onSubmit={handleStartExam} className="space-y-5 sm:space-y-6 mt-4">
          <div className="space-y-2">
            <label htmlFor="studentName" className="block text-[13px] sm:text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
              ชื่อ-นามสกุล <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="studentName"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-premium"
              placeholder="เช่น นายชัชวาลย์ ทะสิละ (ภาษาไทยเท่านั้น)"
            />
            {error && <p className="text-rose-500 text-xs mt-1 ml-1">{error}</p>}
          </div>

          <div className="space-y-4 pt-2">
            <button type="submit" disabled={loading} className="btn-premium flex justify-center items-center">
              {loading ? <div className="loader-ring w-5 h-5 border-[2px] border-t-white mix-blend-screen opacity-70"></div> : 'เริ่มทำข้อสอบ'}
            </button>
            <Link href="/leaderboard" className="btn-outline-premium w-full flex items-center justify-center gap-2">
              <span>🏆</span> ดูกระดานคะแนน (Leaderboard)
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
