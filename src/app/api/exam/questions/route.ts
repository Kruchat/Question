import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('questions')
            .select('id, text, options_json')
            .eq('status', 'active');

        if (error) throw error;
        if (!data || data.length === 0) return NextResponse.json([]);

        const shuffled = data.sort(() => Math.random() - 0.5).map(q => {
            let rawOptions = q.options_json;

            // Force re-parse through JSON to ensure we have plain JS objects
            if (rawOptions && typeof rawOptions !== 'string') {
                rawOptions = JSON.parse(JSON.stringify(rawOptions));
            }
            if (typeof rawOptions === 'string') {
                try { rawOptions = JSON.parse(rawOptions); } catch { rawOptions = []; }
            }
            if (!Array.isArray(rawOptions)) rawOptions = [];

            // Extract text from each option - handle both string[] and {id,text}[] formats
            const plainOptions = rawOptions.map((item: any) => {
                if (!item) return '';
                if (typeof item === 'string') return item;
                // For objects like {id: "a", text: "some option text"}
                if (item.text !== undefined && item.text !== null) return String(item.text);
                return JSON.stringify(item);
            });

            return {
                id: String(q.id),
                text: String(q.text || ''),
                options: plainOptions,
            };
        });

        return NextResponse.json(shuffled);
    } catch (error: any) {
        return NextResponse.json([], { status: 200 });
    }
}
