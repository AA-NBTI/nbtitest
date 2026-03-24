import { ImageResponse } from '@vercel/og';

/**
 * 동적 공유 카드 생성 API (app/api/og/route.jsx)
 * format 파라미터에 따라 해상도 자동 조절
 */

export const runtime = 'edge';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const mbti = searchParams.get('mbti') || 'NBTI';
  const format = searchParams.get('format') || 'card';
  const isStory = format === 'story';

  return new ImageResponse(
    (
      <div style={{
        height: '100%', width: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(to bottom right, #534AB7, #8b5cf6)', color: 'white',
      }}>
        <div style={{ fontSize: isStory ? 48 : 32 }}>NBTI {mbti} 레벨</div>
        <div style={{ fontSize: isStory ? 180 : 120, fontWeight: 900 }}>S 레벨</div>
        <div style={{ position: 'absolute', bottom: 40, fontSize: 24 }}>nbtitest.com</div>
      </div>
    ),
    { width: isStory ? 1080 : 1200, height: isStory ? 1920 : 630 }
  );
}