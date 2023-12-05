import { atom } from "recoil";

// 언어 타입
type LanguageType = 'ko' | 'en'

// 사용자가 설정한 언어상태
export const languageSate = atom<LanguageType>({
    key : 'language',
    default : localStorage.getItem('language') as LanguageType || 'ko',
})