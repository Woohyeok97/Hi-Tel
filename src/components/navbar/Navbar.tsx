import styles from './Navbar.module.scss'
import { useNavigate } from 'react-router-dom'


export default function Navbar() {
    const navigate = useNavigate()


    return (
        <div className={ styles.navbar }> 
            <div className={ styles.navbar__flex }>
                <div className={ styles.navbar__menu } onClick={()=>{ navigate('/') }}>
                    초기화면(A)
                </div>
                <div className={ styles.navbar__menu } onClick={() => { navigate('/') }}>
                    마이페이지(B)
                </div>
                <div className={ styles.navbar__menu } onClick={() => navigate('/search') }>
                    검색(C)
                </div>
                <div className={ styles.navbar__menu } onClick={() => navigate('/users/login') }>접속(D)</div>

                <div className={ styles.navbar__menu }>설정(E)</div>
            </div>

            {/* 명령어 인풋 */}
            <div className={ styles.navbar__flex }>
                <label htmlFor='command'>{'명령어 입력 >> '}</label>
                <input 
                    type="text"
                    id='command'
                    className={ styles.navbar__terminal }
                />
            </div>
        </div>
    )
}