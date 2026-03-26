
// Check Supabase Connectivity and Data Counts
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local manually for values
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const getEnv = (key) => {
  const match = envContent.match(new RegExp(`${key}=(.*)`));
  return match ? match[1].trim() : null;
};

const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
const supabaseKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl || !supabaseKey) {
  console.log("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  const { count: clicksCount, error: cErr } = await supabase.from('nbti_ad_clicks').select('*', { count: 'exact', head: true });
  const { count: adsCount, error: aErr } = await supabase.from('nbti_internal_ads').select('*', { count: 'exact', head: true });
  const { count: resultsCount, error: rErr } = await supabase.from('nbti_results').select('*', { count: 'exact', head: true });
  const { data: recentClicks } = await supabase.from('nbti_ad_clicks').select('*').limit(5).order('created_at', { ascending: false });

  console.log({
    clicksCount,
    adsCount,
    resultsCount,
    recentClicks: recentClicks?.length || 0,
    errors: { cErr: cErr?.message, aErr: aErr?.message, rErr: rErr?.message }
  });

}

checkData();
