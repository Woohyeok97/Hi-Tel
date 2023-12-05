import { languageSate } from "atom"
import TRANSLATIONS from "data/language"
import { useRecoilValue } from "recoil"

export default function useTranslation() {
    // recoil (read only로 사용)
    const language = useRecoilValue(languageSate)

    // 언어상태에 따른 메뉴명변경 함수
    // 현재 언어상태에 따라서 TRANSLATIONS[key]에 해당하는 문자열을 반환함
    const translation = (key : keyof typeof TRANSLATIONS) => {
        return TRANSLATIONS[key][language]
    }

    return { translation }
}