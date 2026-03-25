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

    // 1. 이미 가입된 유저인지 체크
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    const existingUser = users.find(u => u.email === email);

    if (existingUser) {
      // 이미 가입되었으나 인증이 안 된 경우 -> 강제 인증 처리 (Rescue 로직)
      if (!existingUser.email_confirmed_at) {
        console.log("Rescuing unconfirmed user:", email);
        await supabase.auth.admin.updateUserById(existingUser.id, { 
          email_confirm: true,
          password: password // 패스워드도 새로 갱신해줌 (사용자가 잊었을 가능성 대비)
        });
        return Response.json({ success: true, user: existingUser, rescued: true });
      }
      return Response.json({ error: "이미 가입된 이메일입니다. 로그인해 주세요." }, { status: 400 });
    }

    // 2. 신규 가입 처리
    const { data: user, error: signUpError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true 
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
