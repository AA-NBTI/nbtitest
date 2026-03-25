import './globals.css';
import { GlobalStickyBanner } from '@/components/GlobalStickyBanner';

export const metadata = {
  title: 'NBTI — Next Behavioral Trend Indicator',
  description: '누적 테스트로 신뢰도를 높이는 정밀 MBTI 측정 서비스. 성향을 넘어 트렌드 지수까지.',
  openGraph: {
    title: 'NBTI — Beyond Type. Into Trend.',
    description: '누적 테스트로 신뢰도를 높이는 정밀 MBTI 측정 서비스.',
    url: 'https://nbtitest.com',
    siteName: 'NBTI',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NBTI — Beyond Type. Into Trend.',
    description: '누적 테스트로 신뢰도를 높이는 정밀 MBTI 측정 서비스.',
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://nbtitest.com'),
};

import { AuthProvider } from './AuthProvider';

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
      </head>
      {/* paddingTop 100px: 상단 고정 배너가 콘텐츠를 가리지 않도록 */}
      <body style={{ margin: 0, padding: 0, paddingTop: '100px' }}>
        <AuthProvider>
          {/* 05. MAIN_TOP: 375×50 전체 페이지 공통 상단 고정 띠배너 */}
          <GlobalStickyBanner />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
