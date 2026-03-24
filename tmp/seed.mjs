import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

// .env.local 읽기
const envFile = fs.readFileSync('.env.local', 'utf8');
const env = dotenv.parse(envFile);

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const ads = [
  {
    brand_name: 'NBTI 공식 홍보',
    placement: 'TEST_FIXED_TOP',
    title: 'NBTI: 유형을 넘어 트렌드로, 진짜 나를 발견하세요.',
    banner_img_url: '/nbti_promo.png',
    link_url: 'https://nbtitest.com',
    is_active: true,
    ad_format: 'BANNER',
    daily_budget: 999999,
    cpc: 100,
    pricing_model: 'CPM'
  },
  {
    brand_name: 'NBTI 결과 리포트',
    placement: 'TEST_FIXED_BOTTOM',
    title: '내 성격의 진짜 모습을 발견하세요. NBTI 리포트 보기',
    banner_img_url: '/nbti_discovery.png',
    link_url: 'https://nbtitest.com',
    is_active: true,
    ad_format: 'BANNER',
    daily_budget: 999999,
    cpc: 150,
    pricing_model: 'CPM'
  }
];

async function seed() {
  console.log('Seeding ads...');
  for (const ad of ads) {
    const { data, error } = await supabase
      .from('nbti_internal_ads')
      .upsert(ad, { onConflict: 'brand_name,placement' }); // 겹치면 업데이트
    
    if (error) console.error('Error inserting ad:', error);
    else console.log(`Inserted/Updated: ${ad.brand_name}`);
  }
}

seed();
