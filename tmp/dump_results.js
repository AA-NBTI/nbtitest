
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const env = fs.readFileSync('.env.local', 'utf8');
const getEnv = (k) => env.match(new RegExp(k+'=(.*)'))?.[1].trim();
const s = createClient(getEnv('NEXT_PUBLIC_SUPABASE_URL'), getEnv('SUPABASE_SERVICE_ROLE_KEY'));

s.from('nbti_results').select('*').limit(5).then(r => {
    if (r.error) console.error(r.error);
    else {
        console.log("Columns:", Object.keys(r.data[0]));
        console.log("Values:", r.data[0]);
    }
});
