import { default as dotenv } from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const { data, error } = await supabase.from('nbti_questions').select('*').limit(2);
  console.log("Q DATA:", data, "ERROR:", error);

  const { data: vData, error: vErr } = await supabase.from('nbti_question_versions').select('*').limit(2);
  console.log("V DATA:", vData, "ERROR:", vErr);

  const { data: qvData, error: qvErr } = await supabase
    .from('nbti_questions')
    .select(`question_id, nbti_question_versions(*)`)
    .limit(2);
  console.log("JOIN DATA:", JSON.stringify(qvData, null, 2), "ERROR:", qvErr);
}
test();
