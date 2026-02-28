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
            .eq('status', 'active')
            .order('created_at', { ascending: true });

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
                await supabase.from('questions').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
            }

            const newQuestions = questions.map((q: any) => ({
                text: q.text,
                options: q.options,
                correct_answer: parseInt(q.correct_answer ?? q.answer, 10),
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
            const { error } = await supabase.from('questions').insert([{
                text: question.text,
                options: question.options,
                correct_answer: parseInt(question.correct_answer ?? question.answer, 10),
                status: 'active'
            }]);
            if (error) throw error;
            return NextResponse.json({ success: true });
        }

        // Update
        if (action === 'update' && id) {
            const { error } = await supabase.from('questions')
                .update({
                    text: question.text,
                    options: question.options,
                    correct_answer: parseInt(question.correct_answer ?? question.answer, 10),
                })
                .eq('id', id);
            if (error) throw error;
            return NextResponse.json({ success: true });
        }

        // Delete (Soft delete or hard delete; doing hard delete for simplicity)
        if (action === 'delete' && id) {
            const { error } = await supabase.from('questions')
                .delete()
                .eq('id', id);
            if (error) throw error;
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
