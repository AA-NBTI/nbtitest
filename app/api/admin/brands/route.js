import { getAdminClient } from '@/lib/supabase';

/**
 * [파일명: app/api/admin/brands/route.js]
 * 기능: 브랜드 파트너 CRUD API (Admin전용)
 */

export async function GET() {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from('nbti_brands')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

export async function POST(req) {
  const supabase = getAdminClient();
  const body = await req.json();
  
  const { error } = await supabase
    .from('nbti_brands')
    .insert([body]);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true });
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const supabase = getAdminClient();
  
  await supabase.from('nbti_brands').delete().eq('brand_id', id);
  return Response.json({ success: true });
}