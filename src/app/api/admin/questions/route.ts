/* eslint-disable */
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
            .eq('status', 'active');

        if (error) throw error;

        return NextResponse.json(data || []);
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
                // First delete answers that reference questions (FK constraint)
                await supabase.from('answers').delete().neq('id', '00000000-0000-0000-0000-000000000000');
                // Then delete all attempts
                await supabase.from('attempts').delete().neq('attempt_id', '00000000-0000-0000-0000-000000000000');
                // Then delete all existing questions
                const { error: delErr } = await supabase.from('questions').delete().neq('id', '__impossible__');
                if (delErr) throw delErr;
            }

            const newQuestions = questions.map((q: any, idx: number) => {
                // Generate a unique text ID
                const qId = 'Q' + String(idx + 1).padStart(3, '0') + '_' + Math.random().toString(36).substring(2, 6).toUpperCase();

                // Handle options: must be a native array/object for jsonb column
                // If it's already an array, keep it as-is (Supabase handles it)
                // If it's a string, parse it back to an array
                let optionsJson = q.options;
                if (typeof optionsJson === 'string') {
                    try { optionsJson = JSON.parse(optionsJson); } catch (e) { /* keep as string fallback */ }
                }

                // Handle answer: could be index number or text value
                let answerValue = q.answer;
                if (typeof answerValue === 'number' && Array.isArray(q.options)) {
                    answerValue = q.options[answerValue]; // Convert index to text
                }

                return {
                    id: qId,
                    type: 'choice',
                    text: q.text,
                    options_json: optionsJson,
                    answer: String(answerValue),
                    status: 'active'
                };
            });

            if (newQuestions.length > 0) {
                const { error } = await supabase.from('questions').insert(newQuestions);
                if (error) throw error;
            }
            return NextResponse.json({ success: true, count: newQuestions.length });
        }

        // Single create
        if (action === 'create') {
            const qId = 'QA' + Math.random().toString(36).substring(2, 8).toUpperCase();

            let optionsJson = question.options;
            if (typeof optionsJson === 'string') {
                try { optionsJson = JSON.parse(optionsJson); } catch (e) { /* keep */ }
            }

            let answerValue = question.answer;
            if (typeof answerValue === 'number' && Array.isArray(question.options)) {
                answerValue = question.options[answerValue];
            }

            const { error } = await supabase.from('questions').insert([{
                id: qId,
                type: 'choice',
                text: question.text,
                options_json: optionsJson,
                answer: String(answerValue),
                status: 'active'
            }]);
            if (error) throw error;
            return NextResponse.json({ success: true, id: qId });
        }

        // Update
        if (action === 'update' && id) {
            let optionsJson = question.options;
            if (typeof optionsJson === 'string') {
                try { optionsJson = JSON.parse(optionsJson); } catch (e) { /* keep */ }
            }

            let answerValue = question.answer;
            if (typeof answerValue === 'number' && Array.isArray(question.options)) {
                answerValue = question.options[answerValue];
            }

            const { error } = await supabase.from('questions')
                .update({
                    text: question.text,
                    options_json: optionsJson,
                    answer: String(answerValue),
                })
                .eq('id', id);
            if (error) throw error;
            return NextResponse.json({ success: true });
        }

        // Delete
        if (action === 'delete' && id) {
            // Delete related answers first (FK constraint)
            await supabase.from('answers').delete().eq('question_id', id);
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
