import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Helper: ensure each option is a plain string, not an object
function normalizeOptions(options: any): string[] {
    if (!Array.isArray(options)) {
        if (typeof options === 'string') {
            try { options = JSON.parse(options); } catch { return []; }
        } else {
            return [];
        }
    }
    return options.map((opt: any) => {
        if (typeof opt === 'string') return opt;
        if (opt && typeof opt === 'object' && opt.text) return String(opt.text);
        return String(opt);
    });
}

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('questions')
            .select('id, type, text, options_json, answer')
            .eq('status', 'active');

        if (error) throw error;

        // Shuffle questions and normalize options to string arrays
        const shuffled = (data || []).sort(() => Math.random() - 0.5).map(q => ({
            id: q.id,
            type: q.type,
            text: String(q.text || ''),
            options: normalizeOptions(q.options_json),
            answer: q.answer
        }));

        return NextResponse.json(shuffled);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
