import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_for_local_dev');

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        const { data: admin, error } = await supabase
            .from('admins')
            .select('username, password_hash, salt')
            .eq('username', username)
            .single();

        if (error || !admin) {
            return NextResponse.json({ error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' }, { status: 401 });
        }

        // fallback manual master password for dev/support as in original code.gs
        let isMatch = password === '0814730828';

        if (!isMatch) {
            isMatch = await bcrypt.compare(password, admin.password_hash);
        }

        if (!isMatch) {
            return NextResponse.json({ error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' }, { status: 401 });
        }

        // Sign JWT token
        const token = await new SignJWT({ username: admin.username, role: 'admin' })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('24h')
            .sign(JWT_SECRET);

        const response = NextResponse.json({ success: true, message: 'เข้าสู่ระบบสำเร็จ', token });

        // Set cookie
        response.cookies.set('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 // 1 day
        });

        return response;
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
