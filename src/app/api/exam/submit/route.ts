import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const { attemptId, answers } = await req.json();
        if (!attemptId) return NextResponse.json({ error: 'Missing attemptId' }, { status: 400 });

        // 1. Fetch all active questions and correct answers
        const { data: questions, error: qError } = await supabase
            .from('questions')
            .select('id, answer')
            .eq('status', 'active');

        if (qError) throw qError;

        const answersKey: Record<string, string> = {};
        questions.forEach(q => { answersKey[q.id] = q.answer; });

        // 2. Insert or Update answers and calculate score
        let score = 0;
        const answerRows = [];

        for (const [qId, stuAns] of Object.entries(answers as Record<string, string>)) {
            const isCorrect = (stuAns.trim() === answersKey[qId]?.trim()) ? 1 : 0;
            score += isCorrect;

            answerRows.push({
                attempt_id: attemptId,
                question_id: qId,
                answer_value: stuAns,
                is_correct: isCorrect
            });
        }

        // Insert answers to DB
        if (answerRows.length > 0) {
            const { error: ansError } = await supabase.from('answers').insert(answerRows);
            if (ansError) throw ansError;
        }

        // 3. Update attempt status and score
        const { data: attemptUpdate, error: attError } = await supabase
            .from('attempts')
            .update({
                score: score,
                end_time: new Date().toISOString(),
                status: 'submitted'
            })
            .eq('attempt_id', attemptId)
            .select('start_time, end_time')
            .single();

        if (attError) throw attError;

        const startTime = new Date(attemptUpdate.start_time).getTime();
        const endTime = new Date(attemptUpdate.end_time).getTime();
        const timeUsed = (endTime - startTime) / 1000 / 60; // in minutes

        return NextResponse.json({
            success: true,
            score,
            total: questions.length,
            timeUsed
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
