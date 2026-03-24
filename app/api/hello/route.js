import { getAdminClient } from '@/lib/supabase';

export async function GET() {
  const supabase = getAdminClient();
  const { data, error } = await supabase
      .from('nbti_internal_ads')
      .select('ad_id, title, brand_name, target_test, link_url, banner_img_url, ad_format')
      .eq('is_active', true)
      .or(`target_test.eq.all,target_test.eq.dynamic`);
  return Response.json({ data, error });
}
