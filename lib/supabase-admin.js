import { createClient } from '@supabase/supabase-js';

/**
 * [V16] 서버 사이드 전용 어드민 클라이언트
 * - 서비스 롤 키(SERVICE_ROLE_KEY)를 사용하여 RLS를 우회하고 통계 데이터를 수집합니다.
 */
export function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Supabase URL or Service Role Key is missing. Check .env.local');
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
