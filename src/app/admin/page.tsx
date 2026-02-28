'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLogin() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();

            if (res.ok && data.success) {
                router.push('/admin/dashboard');
            } else {
                setError(data.error || 'เข้าสู่ระบบไม่สำเร็จ');
            }
        } catch (err: any) {
            setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card w-full max-w-sm p-6 sm:p-10 animate-fade-in my-auto shrink-0 z-10 w-full">
            <h2 className="text-2xl font-bold font-mitr mb-2 text-center text-gradient">Admin Login</h2>
            <p className="text-slate-500 text-center mb-10 text-sm">เฉพาะผู้ดูแลระบบเท่านั้น</p>

            {error && (
                <div className="mb-6 p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-lg text-sm text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">ชื่อผู้ใช้</label>
                    <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="input-premium"
                        placeholder="Username"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">รหัสผ่าน</label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-premium"
                        placeholder="••••••••"
                    />
                </div>
                <div className="pt-2">
                    <button type="submit" disabled={loading} className="btn-premium flex justify-center items-center">
                        {loading ? <div className="loader-ring w-5 h-5 border-[2px] border-t-white mix-blend-screen opacity-70"></div> : 'เข้าสู่ระบบ'}
                    </button>
                </div>
                <Link href="/" className="block w-full text-center text-sm font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors mt-6">
                    ← กลับหน้าหลัก
                </Link>
            </form>
        </div>
    );
}
