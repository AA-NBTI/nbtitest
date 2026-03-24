import { getAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const { testVersion } = await req.json();
    const supabase = getAdminClient();
    
    // 1. 프로필 생성 (익명) - RLS 회피를 위해 Admin Client 사용
    const { data: profile, error: pErr } = await supabase
      .from('nbti_profiles')
      .insert({})
      .select('id')
      .single();
      
    if (pErr) throw pErr;
    
    // 2. 세션 생성
    const { data: session, error: sErr } = await supabase
      .from('nbti_sessions')
      .insert({ profile_id: profile.id, test_type: testVersion })
      .select('id')
      .single();
      
    if (sErr) throw sErr;
    
    return Response.json({ profileId: profile.id, sessionId: session.id });
  } catch (err) {
    console.error('API /api/start-session Error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
