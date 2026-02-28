'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('settings');

    const [settings, setSettings] = useState<any>({});
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [questions, setQuestions] = useState<any[]>([]);

    const [loading, setLoading] = useState(true);

    const fetchSettings = () => fetch('/api/admin/settings').then(res => res.json()).then(setSettings);
    const fetchLeaderboard = () => fetch('/api/admin/leaderboard').then(res => res.json()).then(setLeaderboard);
    const fetchQuestions = () => fetch('/api/admin/questions').then(res => res.json()).then(setQuestions);

    useEffect(() => {
        Promise.all([fetchSettings(), fetchLeaderboard(), fetchQuestions()])
            .then(() => setLoading(false))
            .catch(err => {
                if (err.message?.includes('Unauthorized') || err?.status === 401) {
                    router.push('/admin');
                } else {
                    setLoading(false);
                }
            });
    }, [router]);

    const handleLogout = async () => {
        await fetch('/api/admin/logout', { method: 'POST' });
        router.push('/admin');
    };

    const handleSaveSettings = async (key: string, value: string) => {
        try {
            await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [key]: value })
            });
            alert('บันทึกสำเร็จ');
            fetchSettings();
        } catch (err) {
            alert('เกิดข้อผิดพลาด');
        }
    };

    const handleDeleteAttempt = async (attemptId: string) => {
        if (!confirm('ยืนยันลบข้อมูลนี้หรือไม่?')) return;
        try {
            await fetch('/api/admin/leaderboard', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ attemptId })
            });
            fetchLeaderboard();
        } catch (err) {
            alert('เกิดข้อผิดพลาด');
        }
    };

    const handleDeleteQuestion = async (id: string) => {
        if (!confirm('ยืนยันลบคำถามนี้หรือไม่?')) return;
        try {
            await fetch('/api/admin/questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'delete', id })
            });
            fetchQuestions();
        } catch (err) {
            alert('เกิดข้อผิดพลาด');
        }
    };

    if (loading) {
        return <div className="loader-ring mx-auto mt-20"></div>;
    }

    return (
        <div className="w-full max-w-6xl animate-fade-in flex flex-col z-10 w-full mb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h2 className="text-2xl sm:text-3xl font-bold font-mitr text-slate-800 dark:text-slate-100">แดชบอร์ดจัดการระบบ</h2>
                <button onClick={handleLogout} className="px-5 py-2.5 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-medium transition-colors text-sm">
                    ออกจากระบบ
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
                {/* Sidebar Tabs */}
                <div className="lg:col-span-1 flex flex-row lg:flex-col gap-2 p-2 glass-card h-min overflow-x-auto lg:overflow-visible">
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`admin-tab whitespace-nowrap px-4 py-3 rounded-xl text-sm font-semibold text-left transition-colors ${activeTab === 'settings' ? 'active' : 'text-slate-600 dark:text-slate-400'}`}
                    >
                        ⚙️ ตั้งค่าระบบ
                    </button>
                    <button
                        onClick={() => setActiveTab('questions')}
                        className={`admin-tab whitespace-nowrap px-4 py-3 rounded-xl text-sm font-semibold text-left transition-colors ${activeTab === 'questions' ? 'active' : 'text-slate-600 dark:text-slate-400'}`}
                    >
                        📝 คลังข้อสอบ
                    </button>
                    <button
                        onClick={() => { setActiveTab('leaderboard'); fetchLeaderboard(); }}
                        className={`admin-tab whitespace-nowrap px-4 py-3 rounded-xl text-sm font-semibold text-left transition-colors ${activeTab === 'leaderboard' ? 'active' : 'text-slate-600 dark:text-slate-400'}`}
                    >
                        🏆 กระดานคะแนน
                    </button>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3 glass-card p-4 sm:p-6 md:p-8 min-h-[400px] sm:min-h-[500px]">

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        <div className="space-y-6 animate-fade-in">
                            <h3 className="text-xl font-bold border-b border-slate-200 dark:border-slate-800 pb-4 mb-6 text-slate-800 dark:text-slate-100 font-mitr">ตั้งค่าระบบ</h3>

                            <div className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl flex flex-col gap-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">สถานะระบบ</div>
                                        <div className="text-sm text-slate-500">เปิดหรือปิดการทำข้อสอบ</div>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-2">
                                    <select
                                        value={settings?.exam_status || 'closed'}
                                        onChange={(e) => setSettings({ ...settings, exam_status: e.target.value })}
                                        className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold focus:ring-2 outline-none"
                                    >
                                        <option value="open">✅ เปิดรับทดสอบ</option>
                                        <option value="closed">⛔ ปิดระบบชั่วคราว</option>
                                    </select>
                                    <button onClick={() => handleSaveSettings('exam_status', settings?.exam_status)} className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium text-sm">
                                        บันทึกสถานะ
                                    </button>
                                </div>
                            </div>

                            <div className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">ระยะเวลาในการสอบ (นาที)</div>
                                    <div className="text-sm text-slate-500">ค่าเริ่มต้นคือ 20 นาที</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="number"
                                        min="1"
                                        value={settings?.time_limit || 20}
                                        onChange={(e) => setSettings({ ...settings, time_limit: e.target.value })}
                                        className="w-24 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 rounded-lg text-center font-semibold outline-none"
                                    />
                                    <button onClick={() => handleSaveSettings('time_limit', settings?.time_limit)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium text-sm">
                                        บันทึก
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Leaderboard Tab */}
                    {activeTab === 'leaderboard' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-4 mb-2">
                                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 font-mitr">ผลสอบทั้งหมด</h3>
                                <button onClick={fetchLeaderboard} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-primary-50">รีเฟรช</button>
                            </div>
                            <div className="overflow-x-auto bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700/50">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 text-sm font-semibold uppercase">
                                            <th className="p-4 border-b border-slate-200 dark:border-slate-700/50">ลำดับ</th>
                                            <th className="p-4 border-b border-slate-200 dark:border-slate-700/50">ชื่อ</th>
                                            <th className="p-4 border-b border-slate-200 dark:border-slate-700/50 text-right">คะแนน</th>
                                            <th className="p-4 border-b border-slate-200 dark:border-slate-700/50 text-right">เวลา(วิ)</th>
                                            <th className="p-4 border-b border-slate-200 dark:border-slate-700/50 text-center">จัดการ</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {leaderboard.length === 0 ? (
                                            <tr><td colSpan={5} className="p-6 text-center text-slate-500">ไม่มีข้อมูล</td></tr>
                                        ) : (
                                            leaderboard.map((row, i) => (
                                                <tr key={row.id}>
                                                    <td className="p-4">{i + 1}</td>
                                                    <td className="p-4 font-medium">{row.name}</td>
                                                    <td className="p-4 text-right font-bold text-primary-600">{row.score}</td>
                                                    <td className="p-4 text-right">{row.timeUsed?.toFixed(1)}</td>
                                                    <td className="p-4 text-center">
                                                        <button onClick={() => handleDeleteAttempt(row.id)} className="text-rose-500 hover:text-rose-700 text-sm font-semibold">ลบ</button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Questions Tab */}
                    {activeTab === 'questions' && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 dark:border-slate-800 pb-4 mb-4 gap-4">
                                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 font-mitr">จัดการคลังข้อสอบ</h3>
                                <button onClick={() => alert('ฟีเจอร์เพิ่มข้อสอบ จะต้องสร้าง Modal เพิ่มในภายหลัง (ใช้ผ่าน Supabase Studio ง่ายกว่าสำหรับเวอร์ชั่นนี้)')} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm shadow-emerald-500/20">
                                    + เพิ่มข้อสอบ
                                </button>
                            </div>
                            <div className="overflow-x-auto bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-slate-200">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 text-slate-500 text-sm font-semibold uppercase tracking-wider">
                                            <th className="p-4 border-b w-16 text-center">#</th>
                                            <th className="p-4 border-b">คำถาม</th>
                                            <th className="p-4 border-b w-24 text-center">ลบ</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-sm">
                                        {questions.map((q, i) => (
                                            <tr key={q.id}>
                                                <td className="p-4 text-center">{i + 1}</td>
                                                <td className="p-4">{q.text}</td>
                                                <td className="p-4 text-center">
                                                    <button onClick={() => handleDeleteQuestion(q.id)} className="text-rose-500 hover:underline">ลบ</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
