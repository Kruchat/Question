import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const revalidate = 0; // Disable cache for real-time leaderboard

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('attempts')
            .select('student_name, score, start_time, end_time')
            .eq('status', 'submitted');

        if (error) throw error;

        const results = data.map(att => {
            const start = new Date(att.start_time).getTime();
            const end = new Date(att.end_time).getTime();
            return {
                name: att.student_name,
                score: att.score || 0,
                timeUsed: (end - start) / 1000 / 60 // minutes
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
