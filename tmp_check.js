import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function counts() {
  const { count: adsCount } = await supabase.from('nbti_internal_ads').select('*', { count: 'exact', head: true });
  const { count: respCount } = await supabase.from('nbti_responses').select('*', { count: 'exact', head: true });
  const { count: resCount } = await supabase.from('nbti_results').select('*', { count: 'exact', head: true });
  console.log({ adsCount, respCount, resCount });
  const { data: ads } = await supabase.from('nbti_internal_ads').select('ad_id, brand_name, ad_format');
  console.log(JSON.stringify(ads, null, 2));
}
counts();
