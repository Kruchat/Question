import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        const { data: settingsData, error } = await supabase.from('settings').select('*');
        if (error) throw error;

        let status = 'closed';
        let timeLimit = 20;

        settingsData.forEach((row) => {
            if (row.key === 'exam_status') status = row.value;
            if (row.key === 'time_limit') timeLimit = parseInt(row.value) || 20;
        });

        return NextResponse.json({ status, timeLimit });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
