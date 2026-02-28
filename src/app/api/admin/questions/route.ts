import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyAuth } from '@/lib/auth';

export async function GET() {
    try {
        const auth = await verifyAuth();
        if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { data, error } = await supabase
            .from('questions')
            .select('*')
            .neq('status', 'deleted');

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const auth = await verifyAuth();
        if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { action, replaceAll, questions, question, id } = await req.json();

        if (action === 'bulk_save') {
            if (replaceAll) {
                await supabase.from('questions').update({ status: 'deleted' }).neq('status', 'deleted');
            }

            const newQuestions = questions.map((q: any) => ({
                id: q.id || ('QA' + Math.random().toString(36).substring(2, 8).toUpperCase()),
                type: 'choice',
                text: q.text,
                options_json: q.options,
                answer: q.answer,
                status: 'active'
            }));

            if (newQuestions.length > 0) {
                const { error } = await supabase.from('questions').insert(newQuestions);
                if (error) throw error;
            }
            return NextResponse.json({ success: true, count: newQuestions.length });
        }

        // Single create
        if (action === 'create') {
            const qId = 'QA' + Math.random().toString(36).substring(2, 8).toUpperCase();
            const { error } = await supabase.from('questions').insert([{
                id: qId,
                type: 'choice',
                text: question.text,
                options_json: question.options,
                answer: question.answer,
                status: 'active'
            }]);
            if (error) throw error;
            return NextResponse.json({ success: true, id: qId });
        }

        // Update
        if (action === 'update' && id) {
            const { error } = await supabase.from('questions')
                .update({
                    text: question.text,
                    options_json: question.options,
                    answer: question.answer,
                })
                .eq('id', id);
            if (error) throw error;
            return NextResponse.json({ success: true });
        }

        // Delete
        if (action === 'delete' && id) {
            const { error } = await supabase.from('questions')
                .update({ status: 'deleted' })
                .eq('id', id);
            if (error) throw error;
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
