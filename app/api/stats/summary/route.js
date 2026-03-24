import { getAdminClient } from '@/lib/supabase-admin';

export async function GET() {
  const supabase = getAdminClient();

  try {
    // 모든결과 중 인구통계 정보가 하나라도 있는 것을 타겟으로 합니다.
    const { data: results, error } = await supabase
      .from('nbti_results')
      .select('gender, age_group, region')
      .or('gender.not.is.null,age_group.not.is.null,region.not.is.null');

    if (error) throw error;

    const total = results?.length || 0;
    const stats = {
      total,
      gender: {},
      age: {},
      region: {}
    };

    results?.forEach(r => {
      if (r.gender) stats.gender[r.gender] = (stats.gender[r.gender] || 0) + 1;
      if (r.age_group) stats.age[r.age_group] = (stats.age[r.age_group] || 0) + 1;
      if (r.region) stats.region[r.region] = (stats.region[r.region] || 0) + 1;
    });

    return Response.json(stats);
  } catch (err) {
    console.error(err);
    return Response.json({ error: 'Stats collection failed' }, { status: 500 });
  }
}
