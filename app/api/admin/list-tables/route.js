import { getAdminClient } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

/**
 * [파일명: app/api/admin/list-tables/route.js]
 * 기능: 데이터베이스의 모든 테이블 목록을 출력하여 활용 가능한 공간 확인
 */
export async function GET() {
  const supabase = getAdminClient();
  try {
    // 1. 모든 테이블 목록 조회 시도 (SELECT 정보 스키마)
    const { data: tables, error } = await supabase
      .from('nbti_questions') // 존재하는 테이블 하나를 기준으로 쿼리
      .select('id')
      .limit(1);

    // SQL을 직접 실행할 수 없으므로, 알려진 테이블들의 구조를 하나씩 확인
    const targetTables = ['nbti_results', 'nbti_responses', 'nbti_profiles', 'nbti_ad_clicks', 'nbti_questions'];
    const results = {};

    for (const table of targetTables) {
      const { data } = await supabase.from(table).select('*').limit(1);
      results[table] = data && data.length > 0 ? Object.keys(data[0]) : "Empty or Not Found";
    }

    return Response.json({ tables: results });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
