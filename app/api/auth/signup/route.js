import { getAdminClient } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

/**
 * [파일명: app/api/auth/signup/route.js]
 * 기능: 이메일 인증 제한(Rate Limit)을 우회하는 즉시 가입 API (관리자 모드)
 */
export async function POST(req) {
  try {
    const { email, password } = await req.json();
    const supabase = getAdminClient();

    // 관리자 기능으로 가입 즉시 '이메일 확인됨' 상태로 생성 (Rate Limit 무시 가능)
    const { data: user, error: signUpError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true // 이 부분이 핵심: 이메일 인증 절차를 건너뜁니다.
    });

    if (signUpError) {
      console.error("Signup Admin Error:", signUpError);
      return Response.json({ error: signUpError.message }, { status: 400 });
    }

    return Response.json({ success: true, user: user.user });
  } catch (err) {
    console.error("Signup API Route Error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
