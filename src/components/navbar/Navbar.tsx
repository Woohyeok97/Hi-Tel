import styles from './Navbar.module.scss'
import { useContext, useState } from 'react'
import AuthContext from 'context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { getAuth, signOut } from 'firebase/auth'
import { app } from 'firebaseApp'
// 데이터 타입 
import { CommandActionsType } from 'interface'


// 터미널메시지 기본값
const initialMessage = '명령어를 입력하십시오.'

export default function Navbar() {
    const { user } = useContext(AuthContext)
    const [ command, setCommand ] = useState<string>('')
    const [ terminalMessage, setTerminalMessage ] = useState<string>(initialMessage)
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

    // 명령어 입력 핸들러
    const handleCommand = (e : React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e?.target;
        setCommand(value?.trim())
    }

    // 명령어 실행함수
    const commandActions : CommandActionsType = {
        'h' : () =>  navigate('/'),
        'p' : () => user?.uid ? navigate(`/profile/${user?.uid}`) : false,
        's' : () => navigate('/search'),
        'w' : () => user?.uid ? navigate('/post/new') : false,
        'q' : () => user?.uid ? handleLogout() : navigate('/users/login'),
    }

    // 명령어 실행 핸들러
    const handleCommandEnter = (e : any) => {
        const ENTER_KEY_CODE = 13
        let terminalMessage = initialMessage
        
        if(command !== '' && e?.keyCode === ENTER_KEY_CODE) {
            const lowerCommand = command.toLowerCase();

            if(lowerCommand in commandActions) {
                const action = commandActions[lowerCommand]()

                if(typeof(action) == 'boolean' && !action) {
                    terminalMessage = '접속이후 이용해주십시오.'
                }

            } else {
                    terminalMessage = '올바른 명령어를 입력하십시오.'
            }

            setCommand('')
            setTerminalMessage(terminalMessage)
        } 
    }


    return (
        <div className={ styles.navbar }> 
            <div className={ styles.navbar__flex }>
                <div className={ styles.navbar__menu } onClick={ commandActions['h'] }>
                    초기화면(H)
                </div>
                <div className={ styles.navbar__menu } onClick={ commandActions['p'] }>
                    마이페이지(P)
                </div>
                <div className={ styles.navbar__menu } onClick={ commandActions['s'] }>
                    검색(S)
                </div>
                <div className={ styles.navbar__menu } onClick={ commandActions['w'] }>
                    글쓰기(W)
                </div>
                <div className={ styles.navbar__menu } onClick={ commandActions['q'] }>
                    { user?.uid ? '접속종료(Q)' : '접속(Q)' }
                </div> 
            </div>

            {/* 명령어 인풋 */}
            <div className={ styles.navbar__flex }>
                <label htmlFor='command'>{'명령어 입력 >> '}</label>
                <input 
                    type="text"
                    id='command'
                    onChange={ handleCommand }
                    onKeyUp={ handleCommandEnter }
                    value={ command }
                    placeholder={ terminalMessage }
                    className={ styles.navbar__terminal }
                />
            </div>
        </div>
    )
}