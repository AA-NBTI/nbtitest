import { getAdminClient } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

/**
 * [파일명: app/api/admin/debug-schema/route.js]
 * 기능: nbti_results 및 nbti_profiles 테이블 스키마 정밀 진단
 */
export async function GET() {
  const supabase = getAdminClient();
  try {
    // 1. nbti_results 테이블 확인
    const { data: resultsSample } = await supabase.from('nbti_results').select('*').limit(1);
    const hasResultsUserId = resultsSample && resultsSample.length > 0 ? ('user_id' in resultsSample[0]) : false;

    // 2. nbti_profiles 테이블 확인
    const { data: profilesSample } = await supabase.from('nbti_profiles').select('*').limit(1);
    const hasProfilesUserId = profilesSample && profilesSample.length > 0 ? ('user_id' in profilesSample[0]) : false;
    const hasProfilesSessionId = profilesSample && profilesSample.length > 0 ? ('session_id' in profilesSample[0]) : false;

    return Response.json({ 
      nbti_results: {
        hasUserId: hasResultsUserId,
        sample: resultsSample?.[0] || "No data"
      },
      nbti_profiles: {
        hasUserId: hasProfilesUserId,
        hasSessionId: hasProfilesSessionId,
        sample: profilesSample?.[0] || "No data"
      }
    });
  } catch (err) {
    console.error("Debug Schema Error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
