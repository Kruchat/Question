import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const { name, group } = await req.json();
        if (!name) return NextResponse.json({ error: 'กรุณากรอกชื่อ' }, { status: 400 });

        const { data: settingsData } = await supabase.from('settings').select('*');
        let status = 'closed';
        settingsData?.forEach((row) => {
            if (row.key === 'exam_status') status = row.value;
        });

        if (status !== 'open') return NextResponse.json({ error: 'ระบบปิดรับการทดสอบแล้ว' }, { status: 403 });

        const { data, error } = await supabase
            .from('attempts')
            .insert([{
                session_id: 'SESS01',
                student_name: name,
                student_group: group || '',
                status: 'in-progress'
            }])
            .select('attempt_id, start_time')
            .single();

        if (error) throw error;

        return NextResponse.json({
            success: true,
            attemptId: data.attempt_id,
            startTime: (new Date(data.start_time)).getTime()
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
