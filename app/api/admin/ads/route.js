import { getAdminClient } from '@/lib/supabase';

/**
 * [파일명: app/api/admin/ads/route.js]
 * 기능: 자체 광고 캠페인 CRUD 및 활성 토글 API
 */

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const supabase = getAdminClient();
  const { data: ads, error } = await supabase
    .from('nbti_internal_ads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });

  // 오늘 발생한 클릭들을 가져와서 개별 캠페인별로 예산 차감을 계산합니다.
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const { data: clicks } = await supabase
    .from('nbti_ad_clicks')
    .select('ad_id, created_at')
    .gte('created_at', todayStart.toISOString());

  // 계산된 consumption 필드 매핑
  const augmentedAds = ads.map(ad => {
    const todayClicksCount = clicks ? clicks.filter(c => c.ad_id === ad.ad_id).length : 0;
    const spentToday = todayClicksCount * (ad.cpc || 250);
    return { ...ad, spent_today: spentToday, today_clicks: todayClicksCount };
  });

  return Response.json(augmentedAds);
}

export async function POST(req) {
  const supabase = getAdminClient();
  const body = await req.json();
  
  const { error } = await supabase
    .from('nbti_internal_ads')
    .insert([body]);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true });
}

export async function PATCH(req) {
  const supabase = getAdminClient();
  const body = await req.json();
  const { ad_id, ...updates } = body;
  
  const { error } = await supabase
    .from('nbti_internal_ads')
    .update(updates)
    .eq('ad_id', ad_id);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true });
}

export async function DELETE(req) {
  const supabase = getAdminClient();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  const { error } = await supabase
    .from('nbti_internal_ads')
    .delete()
    .eq('ad_id', id);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true });
}