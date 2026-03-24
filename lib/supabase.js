import { createClient } from '@supabase/supabase-js';

/**
 * Supabase 클라이언트 설정 (lib/supabase.js)
 * NEXT_PUBLIC_ 변수는 브라우저와 서버 모두에서 접근 가능합니다.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 클라이언트용 익명 접속 객체
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 서버용 관리자 접속 객체 (Service Role Key 필수)
export const getAdminClient = () => {
  return createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
};