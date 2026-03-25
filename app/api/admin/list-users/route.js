import { getAdminClient } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

/**
 * [파일명: app/api/admin/list-users/route.js]
 * 기능: 서비스 사용자 목록 조회 (디버깅용)
 */
export async function GET() {
  try {
    const supabase = getAdminClient();
    
    // Auth 사용자 목록 조회 (관리자 접근)
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    
    if (error) throw error;
    
    return Response.json({
      total: users.length,
      users: users.map(u => ({
        id: u.id,
        email: u.email,
        confirmed: !!u.email_confirmed_at,
        last_sign_in: u.last_sign_in_at,
        created_at: u.created_at
      }))
    });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
