import styles from './Navbar.module.scss'
import { useContext } from 'react'
import AuthContext from 'context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { getAuth, signOut } from 'firebase/auth'
import { app } from 'firebaseApp'



export default function Navbar() {
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()

    // 로그아웃 핸들러
    const handleLogout = async () => {
        const confirm = window.confirm('접속을 종료하시겠습니까?')
        if(confirm) {
            const auth = getAuth(app)
            await signOut(auth)

            console.log('접속을 종료하셨습니다.')
        }
    }

    return (
        <div className={ styles.navbar }> 
            <div className={ styles.navbar__flex }>
                <div className={ styles.navbar__menu } onClick={()=>{ navigate('/') }}>
                    초기화면(A)
                </div>
                <div className={ styles.navbar__menu } onClick={() => { navigate(`/profile/${user?.uid}`) }}>
                    마이페이지(B)
                </div>
                <div className={ styles.navbar__menu } onClick={() => navigate('/search') }>
                    검색(C)
                </div>
                <div className={ styles.navbar__menu } 
                    onClick={() => user?.uid ? navigate('/post/new') : console.log('접속후 이용하십시오.') }>
                    글쓰기(D)
                </div>

                { user?.uid ? 
                <div className={ styles.navbar__menu } onClick={ handleLogout }>
                    접속종료(E)
                </div> 
                : 
                <div className={ styles.navbar__menu } onClick={() => navigate('/users/login') }>
                    접속(E)
                </div> }
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