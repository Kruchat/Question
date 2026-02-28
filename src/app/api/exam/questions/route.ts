import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('questions')
            .select('id, type, text, options_json')
            .eq('status', 'active');

        if (error) throw error;

        // Shuffle questions
        const shuffled = data.sort(() => Math.random() - 0.5).map(q => ({
            ...q,
            options: typeof q.options_json === 'string' ? JSON.parse(q.options_json) : q.options_json
        }));

        return NextResponse.json(shuffled);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
