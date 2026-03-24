import { getAdminClient } from '@/lib/supabase';

export const revalidate = 3600; // 1시간 캐시 - 화면 로딩속도 극대화

export async function GET(req) {
  try {
    const supabase = getAdminClient();
    const { searchParams } = new URL(req.url);
    const placement = searchParams.get('placement') || '';
    
    // 활성화된 광고만, placement 파라미터가 있으면 해당 위치만 가져온다.
    let query = supabase.from('nbti_internal_ads')
      .select('ad_id, brand_name, title, link_url, placement, banner_img_url, emoji_icon, target_mbti')
      .eq('is_active', true);
      
    if (placement) {
      query = query.eq('placement', placement);
    }
    
    const { data: ads, error } = await query;
    if (error) throw error;
    
    return Response.json(ads);
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
