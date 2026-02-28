import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyAuth } from '@/lib/auth';

export const revalidate = 0;

export async function GET() {
    try {
        const auth = await verifyAuth();
        if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { data, error } = await supabase
            .from('attempts')
            .select('*')
            .eq('status', 'submitted');

        if (error) throw error;

        const results = data.map((att: any) => {
            const start = new Date(att.start_time).getTime();
            const end = new Date(att.end_time).getTime();
            return {
                id: att.attempt_id,
                name: att.student_name,
                group: att.student_group,
                score: att.score || 0,
                timeUsed: (end - start) / 1000 // seconds
            };
        });

        results.sort((a, b) => {
            if (b.score === a.score) return a.timeUsed - b.timeUsed;
            return b.score - a.score;
        });

        return NextResponse.json(results);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const auth = await verifyAuth();
        if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { attemptId } = await req.json();

        if (!attemptId) return NextResponse.json({ error: 'Missing attemptId' }, { status: 400 });

        const { error } = await supabase
            .from('attempts')
            .delete()
            .eq('attempt_id', attemptId);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
