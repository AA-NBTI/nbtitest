import './globals.css';

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

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
