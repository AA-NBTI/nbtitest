import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// [수정] 내부 create 삭제 및 외부 스토어 임포트
import { useTestStore } from '@/store/useTestStore';

/**
 * [V12 최종본] 4순위: 스와이프 UX 컴포넌트 (QuestionSlider)
 * 수정사항: 
 * 1. 중복 정의된 내부 Zustand Store 제거 (store/useTestStore.js 참조하도록 수정)
 * 2. 선택 상태(selectedValue) 시각적 피드백 및 전환 락 유지
 * 3. 16p 스타일 7단계 척도 가이드 적용
 */

const LIKERT_OPTIONS = [
  { value: 7, label: '매우 그렇다', color: 'bg-indigo-600', border: 'border-indigo-600', size: 'w-10 h-10 sm:w-12 sm:h-12' },
  { value: 6, label: '', color: 'bg-indigo-500', border: 'border-indigo-500', size: 'w-10 h-10 sm:w-12 sm:h-12' },
  { value: 5, label: '', color: 'bg-indigo-400', border: 'border-indigo-400', size: 'w-10 h-10 sm:w-12 sm:h-12' },
  { value: 4, label: '보통', color: 'bg-gray-400', border: 'border-gray-400', size: 'w-10 h-10 sm:w-12 sm:h-12' },
  { value: 3, label: '', color: 'bg-purple-400', border: 'border-purple-400', size: 'w-10 h-10 sm:w-12 sm:h-12' },
  { value: 2, label: '', color: 'bg-purple-500', border: 'border-purple-500', size: 'w-10 h-10 sm:w-12 sm:h-12' },
  { value: 1, label: '전혀 아니다', color: 'bg-purple-600', border: 'border-purple-600', size: 'w-10 h-10 sm:w-12 sm:h-12' },
];

export function QuestionSlider() {
  // store/useTestStore.js에서 정의된 액션과 상태를 사용합니다.
  const { questions, currentIndex, setAnswer, isTransitioning, setTransitioning, nextQuestion, recordAdClick } = useTestStore();
  const [startTime, setStartTime] = useState(Date.now());
  const [selectedValue, setSelectedValue] = useState(null);

  const question = questions[currentIndex];

  // 질문이 변경될 때마다 시간과 선택값 초기화
  useEffect(() => {
    setStartTime(Date.now());
    setSelectedValue(null);
  }, [currentIndex]);

  const handleSelect = (val) => {
    if (isTransitioning) return; // 애니메이션 중 클릭 락

    const responseTimeMs = Date.now() - startTime;
    
    // 시각적 피드백 반영
    setSelectedValue(val);
    
    // 데이터 저장 (세부 데이터 axis, polarity, isAd 포함)
    setAnswer(
      question.question_id, 
      question.version_id, 
      val, 
      responseTimeMs, 
      question.axis, 
      question.polarity,
      question.isAd
    );
    
    // 전환 락 활성화
    setTransitioning(true);

    // 부드러운 스와이프를 위한 딜레이 후 다음 문항 이동
    setTimeout(() => {
      nextQuestion();
    }, 350);
  };

  return (
    <div className="w-full max-w-lg mx-auto overflow-hidden px-4 py-8 bg-white rounded-3xl shadow-sm">
      
      {/* 텍스트 영역만 슬라이딩 애니메이션 */}
      <div className="min-h-[160px] flex flex-col justify-end pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={question.question_id}
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -15, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-full flex flex-col items-center text-center"
          >
          {/* 1. 공식 스폰서 문항 (대놓고 광고) vs 2. 일반 문항 & 네이티브 광고 처리 분기 */}
          {question.ad_format === 'SPONSORED_LIKERT' ? (
            <div className="bg-emerald-50 border border-emerald-200 p-4 sm:p-6 rounded-2xl mb-8 w-[95%] text-center relative overflow-hidden shadow-inner mx-auto">
              <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-bl-xl shadow-sm tracking-wide">SPONSORED CAMPAIGN</div>
              <span className="text-emerald-700 font-extrabold text-xs sm:text-sm tracking-widest mb-2 block uppercase">
                {question.brand_name || '제휴 파트너'} 스페셜 문항
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 leading-snug break-keep min-h-[4rem] px-2 w-full whitespace-pre-wrap mt-2">
                {question.content}
              </h2>
            </div>
          ) : (
            <>
              {/* 순수 오리지널(혹은 NATIVE 위장) 심리 테스트 문항 UI */}
              <span className="text-indigo-600 font-black text-sm tracking-widest mb-4 block">
                QUESTION {currentIndex + 1}
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 leading-snug break-keep min-h-[4rem] px-2 w-full whitespace-pre-wrap">
                {question.content}
              </h2>
            </>
          )}

          {/* 구글 애드센스(GDN) 방식의 화면 내 삽입형 배너 (문항 바로 밑에 자연스럽게 기생) */}
          {question.attachedAd && (
            <a 
              href={question.attachedAd.link_url ? (question.attachedAd.link_url.startsWith('http') ? question.attachedAd.link_url : `https://${question.attachedAd.link_url}`) : '#'} 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => recordAdClick(question.attachedAd.question_id)}
              className="mt-6 mb-2 block w-[90%] bg-white border border-slate-200 rounded-xl p-3 cursor-pointer hover:bg-slate-50 transition-all mx-auto relative overflow-hidden group shadow-sm hover:-translate-y-1 active:translate-y-0"
            >
              <div className="absolute top-0 right-0 bg-slate-200/80 text-[8px] text-slate-500 font-black px-1.5 py-0.5 rounded-bl-lg backdrop-blur-sm z-10 transition-colors group-hover:bg-indigo-100 group-hover:text-indigo-600">스폰서 광고</div>
              
              {question.attachedAd.banner_img_url && (
                <div className="w-full aspect-[2/1] mb-3 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 relative flex items-center justify-center shadow-inner">
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent z-10 pointer-events-none" />
                   <img 
                      src={question.attachedAd.banner_img_url} 
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" 
                      alt="스폰서 미디어 배너" 
                   />
                </div>
              )}
              
              <div className="flex items-center justify-between font-bold px-1 mt-1">
                <span className="text-slate-700 text-[14px] truncate pr-4">{question.attachedAd.content}</span>
                <span className="text-indigo-600 font-black text-[11px] group-hover:underline flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded-md">알아보기 <span className="text-[9px]">↗</span></span>
              </div>
            </a>
          )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 7단계 리커트 척도 인터랙션 UI (완전 고정) */}
      <div className="w-full relative mb-6">
        <div className="absolute top-1/2 left-[10%] right-[10%] h-1 bg-gray-100 -translate-y-1/2 -z-10 rounded-full" />
        
        <div className="flex justify-between items-center w-full">
          {LIKERT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              disabled={isTransitioning}
              className={`
                group relative flex flex-col items-center justify-center transition-all duration-200
                ${opt.size} rounded-full border-[3px] 
                ${isTransitioning ? 'cursor-default' : 'cursor-pointer hover:scale-110'}
                ${selectedValue === opt.value ? `${opt.color} border-transparent` : 'bg-white border-gray-200'}
                active:scale-95
              `}
            />
          ))}
        </div>
      </div>

      {/* 하단 텍스트 라벨 가이드 (완전 고정) */}
      <div className="w-full flex justify-between items-center px-1 mt-2">
        <span className="text-indigo-600 font-extrabold text-xs sm:text-sm w-20 text-left leading-tight cursor-default">매우 그렇다</span>
        <div className="flex items-center text-gray-300 font-bold select-none">
          <span className="text-[14px]">◀</span>
          <span className="text-[12px]">◀</span>
          <span className="text-[10px]">◀</span>
          
          <span className="text-gray-500 font-black px-2 text-[13px] sm:text-sm tracking-widest leading-none" style={{ transform: 'translateY(-1px)' }}>보통</span>
          
          <span className="text-[10px]">▶</span>
          <span className="text-[12px]">▶</span>
          <span className="text-[14px]">▶</span>
        </div>
        <span className="text-purple-600 font-extrabold text-xs sm:text-sm w-20 text-right leading-tight cursor-default">전혀 아니다</span>
      </div>
    </div>
  );
}

// 개발용 프리뷰 컴포넌트 (실제 서비스 배포 시 page.jsx에서 호출)
export default function App() {
  const { currentIndex } = useTestStore();
  
  const mockQuestions = [
    { question_id: 'GEN_EI_01', version_id: 1, axis: 'EI', polarity: 1, content: '사람들과 어울리면 에너지가 생기는 편이다.' },
    { question_id: 'GEN_SN_01', version_id: 1, axis: 'SN', polarity: -1, content: '미래에 대한 상상보다 현재의 경험을 더 중시한다.' },
    { question_id: 'GEN_TF_01', version_id: 1, axis: 'TF', polarity: 1, content: '결정을 내릴 때 감정보다 논리적인 근거를 우선한다.' },
  ];

  const currentQuestion = mockQuestions[currentIndex] || mockQuestions[0];

  if (currentIndex >= mockQuestions.length) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
        <div className="text-center p-8 bg-white rounded-3xl shadow-xl">
          <h1 className="text-2xl font-bold mb-4 text-indigo-600">분석 완료</h1>
          <p className="text-gray-600">서버로 데이터를 전송하여 분석 결과를 생성합니다.</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-full font-bold"
          >
            다시 하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <QuestionSlider question={currentQuestion} />
    </div>
  );
}