import { getAdminClient } from '@/lib/supabase';

export async function GET() {
  const supabase = getAdminClient();

  const { data: responses, error } = await supabase
    .from('nbti_responses')
    .select('question_id, answer_value, time_ms');

  if (error) return Response.json({ error: error.message }, { status: 500 });
  if (!responses || responses.length === 0) return Response.json({ neutralBias: [], responseTimes: [] });

  const questionStats = {};

  responses.forEach(r => {
    // 광고 데이터는 번호 체계가 다르므로 품질 분석에서 제외
    if (!r.question_id || r.question_id.startsWith('AD_')) return;
    
    if (!questionStats[r.question_id]) {
      questionStats[r.question_id] = { total: 0, neutral: 0, timeSum: 0 };
    }
    const q = questionStats[r.question_id];
    q.total += 1;
    if (r.answer_value === 4) q.neutral += 1; 
    q.timeSum += r.time_ms || 0;
  });

  // 'GEN_EI_01' 같은 문자열 ID에서 '01' 추출
  const extractNum = (sid) => {
    const match = sid.match(/\d+$/);
    return match ? parseInt(match[0], 10) : 999;
  };

  const neutralBias = Object.entries(questionStats).map(([id, s]) => ({
    id: extractNum(id), // 숫자로 표기
    ratio: parseFloat(((s.neutral / s.total) * 100).toFixed(1))
  })).sort((a, b) => a.id - b.id);

  const responseTimes = Object.entries(questionStats).map(([id, s]) => ({
    id: extractNum(id),
    sec: parseFloat(((s.timeSum / s.total) / 1000).toFixed(2))
  })).sort((a, b) => a.id - b.id);

  return Response.json({
    neutralBias: neutralBias.slice(0, 28),
    responseTimes: responseTimes.slice(0, 28)
  });
}