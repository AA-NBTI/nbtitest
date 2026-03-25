import { getAdminClient } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

/**
 * [파일명: app/api/admin/debug-schema/route.js]
 * 기능: nbti_results 테이블에 user_id 컬럼이 있는지 확인하고 없으면 추가 시도
 */
export async function GET() {
  const supabase = getAdminClient();
  try {
    // 1. 현재 컬럼 확인
    const { data: cols } = await supabase.rpc('get_table_columns', { table_name: 'nbti_results' });
    
    // RPC가 없는 경우 대비하여 실제 데이터로 체크
    const { data: sample } = await supabase.from('nbti_results').select('*').limit(1);
    const hasUserId = sample && sample.length > 0 ? ('user_id' in sample[0]) : false;

    if (!hasUserId) {
      // 2. 컬럼 추가 트라이 (SQL Direct)
      await supabase.rpc('run_sql', { sql: `ALTER TABLE nbti_results ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);` });
      await supabase.rpc('run_sql', { sql: `ALTER TABLE nbti_responses ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);` });
    }

    return Response.json({ hasUserId, sample: sample?.[0] || {} });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
