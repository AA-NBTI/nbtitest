import { create } from 'zustand';

/**
 * 안프로 요구사항: 전역 상태 관리 (Zustand)
 * 기능: 광고 문항 플래그(isAd) 및 세부 응답 데이터 수집
 */

export const useTestStore = create((set, get) => ({
  currentIndex: 0,
  answers: [],
  questions: [],
  profileId: null,
  sessionId: null,
  isTransitioning: false,
  clickedAds: [],
  fixedAds: { top: null, bottom: null },

  initTest: (profileId, sessionId, questions, fixedAds) => set({
    profileId,
    sessionId,
    questions,
    currentIndex: 0,
    answers: [],
    clickedAds: [],
    isTransitioning: false,
    fixedAds: fixedAds || { top: null, bottom: null }
  }),

  recordAdClick: (adId) => set((state) => ({
    clickedAds: [...state.clickedAds, adId]
  })),

  setAnswer: (questionId, versionId, answerValue, timeMs, axis, polarity, isAd = false) => set((state) => {
    const newAnswers = [...state.answers];
    newAnswers[state.currentIndex] = { questionId, versionId, answerValue, timeMs, axis, polarity, isAd };
    return { answers: newAnswers };
  }),

  setTransitioning: (status) => set({ isTransitioning: status }),

  nextQuestion: () => set((state) => ({ 
    currentIndex: state.currentIndex + 1,
    isTransitioning: false 
  })),

  setCurrentIndex: (idx) => set({ currentIndex: idx }),

  resetStore: () => set({ currentIndex: 0, answers: [], isTransitioning: false })
}));