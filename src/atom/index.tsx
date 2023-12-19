import { atom } from "recoil";

// 언어 타입
type LanguageType = 'ko' | 'en'

// 사용자가 설정한 언어상태
export const languageSate = atom<LanguageType>({
    key : 'language',
    // 디폴트값으로 로컬스토리지에 저장된값을 가져오고, 만약없다면 'ko'로 설정
    default : localStorage.getItem('language') as LanguageType || 'ko',
})

export const searchQueryState = atom<string>({
    key : 'searchQuery',
    default : '',
})