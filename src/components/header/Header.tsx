import { Link } from 'react-router-dom'
import styles from './Header.module.scss'
import { useRecoilState } from 'recoil'
import { languageSate } from 'atom'


export default function Header() {
    const [ language, setLanguage ] = useRecoilState(languageSate)

    // 언어변경 핸들러
    const handleLanguage = () => {
        setLanguage((prev) => prev === 'ko' ? 'en' : 'ko')
        // state변경이 비동기적이기 때문에 로컬스토리지에 저장할값을 수동으로 설정해줌
        localStorage.setItem('language', language === 'ko' ? 'en' : 'ko')
    }
 
    return (
        <header className={ styles.header }>
            <h1>HI-TEL</h1>
            <div className={ styles.header__utils }>
                <div className={ styles.header__util } onClick={ handleLanguage }>
                    { language === 'ko' ? '언어' : 'Language' }
                </div>
                {/* <div className={ styles.header__util }>
                    <Link to='/notification'>알림</Link>
                </div> */}
            </div>
        </header>
    )
}