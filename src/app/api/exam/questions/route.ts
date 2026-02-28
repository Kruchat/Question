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

        // Shuffle questions
        const shuffled = data.sort(() => Math.random() - 0.5).map(q => {
            // Parse options_json - it may be a string, array of strings, or array of {id, text} objects
            let rawOptions = q.options_json;
            if (typeof rawOptions === 'string') {
                try { rawOptions = JSON.parse(rawOptions); } catch { rawOptions = []; }
            }
            if (!Array.isArray(rawOptions)) rawOptions = [];

            // Convert each option to a plain string
            const options: string[] = [];
            for (let i = 0; i < rawOptions.length; i++) {
                const item = rawOptions[i];
                if (item === null || item === undefined) {
                    options.push('');
                } else if (typeof item === 'string') {
                    options.push(item);
                } else if (typeof item === 'object') {
                    // Handle {id: "a", text: "some text"} format
                    options.push(item.text ? String(item.text) : JSON.stringify(item));
                } else {
                    options.push(String(item));
                }
            }

            return {
                id: String(q.id),
                text: String(q.text || ''),
                options: options,
            };
        });

        return NextResponse.json(shuffled);
    } catch (error: any) {
        return NextResponse.json([], { status: 200 });
    }
}
