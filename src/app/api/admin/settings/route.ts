import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyAuth } from '@/lib/auth';

export async function GET() {
    try {
        const auth = await verifyAuth();
        if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { data: settingsData, error } = await supabase.from('settings').select('*');
        if (error) throw error;

        const settings: Record<string, string> = {};
        settingsData.forEach((row) => {
            settings[row.key] = row.value;
        });

        return NextResponse.json(settings);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const auth = await verifyAuth();
        if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();

        // Convert object to upsert array
        const updates = Object.keys(body).map(key => ({
            key,
            value: String(body[key])
        }));

        if (updates.length > 0) {
            const { error } = await supabase.from('settings').upsert(updates, { onConflict: 'key' });
            if (error) throw error;
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
