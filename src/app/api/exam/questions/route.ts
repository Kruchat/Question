import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Helper: ensure each option is a plain string, not an object like {id, text}
function normalizeOptions(rawOptions: any): string[] {
    let options = rawOptions;
    if (!options) return [];
    if (typeof options === 'string') {
        try { options = JSON.parse(options); } catch { return []; }
    }
    if (!Array.isArray(options)) return [];
    return options.map((opt: any) => {
        if (typeof opt === 'string') return opt;
        if (opt && typeof opt === 'object' && 'text' in opt) return String(opt.text);
        return String(opt);
    });
}

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('questions')
            .select('id, text, options_json')
            .eq('status', 'active');

        if (error) throw error;
        if (!data || data.length === 0) return NextResponse.json([]);

        // Shuffle questions and normalize options to plain string arrays
        const shuffled = data.sort(() => Math.random() - 0.5).map(q => ({
            id: String(q.id),
            text: String(q.text || ''),
            options: normalizeOptions(q.options_json),
        }));

        return NextResponse.json(shuffled);
    } catch (error: any) {
        return NextResponse.json([], { status: 200 });
    }
}
