import styles from './Navbar.module.scss'
import { useContext, useState } from 'react'
import AuthContext from 'context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { getAuth, signOut } from 'firebase/auth'
import { app } from 'firebaseApp'
// hooks
import useTranslation from 'hooks/useTranslation'
// 데이터 타입 
import { CommandActionsType } from 'interface'


// 터미널메시지 기본값
const INITIAL_MESSAGE = '명령어를 입력하십시오.'

export default function Navbar() {
    const { user } = useContext(AuthContext)
    const [ command, setCommand ] = useState<string>('')
    const [ terminalMessage, setTerminalMessage ] = useState<string>(INITIAL_MESSAGE)
    const navigate = useNavigate()
    // 언어변경 커스텀 훅
    const { translation } = useTranslation()
    

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
        'h' : () => {
            navigate('/')
            setTerminalMessage(INITIAL_MESSAGE) 
        },
        'p' : () => {
            user?.uid
            ? navigate(`/profile/${user?.uid}`)
            : setTerminalMessage('접속이후 이용해주십시오.')
        }, 
        's' : () => {
            navigate('/search')
            setTerminalMessage(INITIAL_MESSAGE) 
        },
        'w' : () => {
            user?.uid
            ? navigate('/post/new') 
            : setTerminalMessage('접속이후 이용해주십시오.')
        },
        'q' : () => {
            user?.uid
            ? handleLogout()
            : navigate('/users/login')

            setTerminalMessage(INITIAL_MESSAGE)
        },
    }

    // 명령어 실행 핸들러
    const handleCommandEnter = (e : any) => {
        const ENTER_KEY_CODE = 13 // 엔터키 keyCode값
        
        if(command !== '' && e?.keyCode === ENTER_KEY_CODE) {
            // 대소문자 구별x(명령어 소문자 변환)
            const lowerCommand = command.toLowerCase();

            // 입력한명령어가 commandActions에 속한 key값일때
            if(lowerCommand in commandActions) {
                const action = commandActions[lowerCommand]
                action()
            } else {
                setTerminalMessage('올바른 명령어를 입력하십시오.')
            }
            setCommand('')
        } 
    }


    return (
        <div className={ styles.navbar }> 
            <div className={ styles.navbar__flex }>
                <div className={ styles.navbar__menu } onClick={ commandActions['h'] }>
                    { translation('MENU_HOME') }(H)
                </div>
                <div className={ styles.navbar__menu } onClick={ commandActions['p'] }>
                    { translation('MENU_PROFILE') }(P)
                </div>
                <div className={ styles.navbar__menu } onClick={ commandActions['s'] }>
                    { translation('MENU_SEARCH') }(S)
                </div>
                <div className={ styles.navbar__menu } onClick={ commandActions['w'] }>
                    { translation('MENU_WRITE') }(W)
                </div>
                <div className={ styles.navbar__menu } onClick={ commandActions['q'] }>
                    { user?.uid ? `${translation('MENU_LOGOUT')}(Q)` : `${translation('MENU_LOGIN')}(Q)` }
                </div> 
            </div>

            {/* 명령어 인풋 */}
            <div className={ styles.navbar__flex }>
                <label htmlFor='command'>{ translation('MENU_COMMAND') } : </label>
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