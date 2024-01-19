import { useContext, useState } from 'react'
import AuthContext from 'context/AuthContext'
import { useRecoilState } from 'recoil'
import { languageSate } from 'atom'
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
    const [ language, setLanguage ] = useRecoilState(languageSate)
    const navigate = useNavigate()

    const { translation } = useTranslation()
    

    // 로그아웃 핸들러
    const handleLogout = async () => {
        const confirm = window.confirm('접속을 종료하시겠습니까?')
        if(confirm) {
            const auth = getAuth(app)
            await signOut(auth)

            navigate('/')
            console.log('접속을 종료하셨습니다.')
        }
    }

    // 언어변경 핸들러
    const handleLanguage = () => {
        setLanguage((prev) => prev === 'ko' ? 'en' : 'ko')
        // state변경이 비동기적이기 때문에 로컬스토리지에 저장할값을 수동으로 설정해줌
        localStorage.setItem('language', language === 'ko' ? 'en' : 'ko')
    }

    // 명령어 입력 핸들러
    const handleCommand = (e : React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e?.target;
        setCommand(value?.trim())
    }

    // 명령어 실행함수
    const commandActions : CommandActionsType = {
        // 초기화면
        'h' : () => {
            navigate('/')
            setTerminalMessage(INITIAL_MESSAGE) 
        },
        // 마이페이지
        'p' : () => {
            user?.uid
            ? navigate(`/profile/${user?.uid}`)
            : setTerminalMessage('접속이후 이용해주십시오.')
        }, 
        // 검색
        's' : () => {
            navigate('/search')
            setTerminalMessage(INITIAL_MESSAGE) 
        },
        // 글작성
        'w' : () => {
            user?.uid
            ? navigate('/post/new') 
            : setTerminalMessage('접속이후 이용해주십시오.')
        },
        // 로그인/로그아웃
        'q' : () => {
            user?.uid
            ? handleLogout()
            : navigate('/users/login')

            setTerminalMessage(INITIAL_MESSAGE)
        },
        // 언어설정
        'l' : () => {
            handleLanguage()
            setTerminalMessage(INITIAL_MESSAGE) 
        },
        // 알림
        'n' : () => {
            user?.uid
            ? navigate('/notification') 
            : setTerminalMessage('접속이후 이용해주십시오.')
        }
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
        <div className="flex flex-col h-full flex-grow-1 grow justify-between bg-bgColor border-t-2 mx-3 py-2
            lg:p-0 lg:mx-0 lg:border-0">
            <div className="flex justify-between gap-1 px-2 lg:flex-col lg:px-8 lg:gap-5">
                <div className='text-btn hidden lg:block' onClick={ commandActions['h'] }>
                    { translation('MENU_HOME') }(H)
                </div>
                <div className='text-btn' onClick={ commandActions['n'] }>
                    { translation('MENU_NOTI') }(N)
                </div>
                <div className='text-btn' onClick={ commandActions['p'] }>
                    { translation('MENU_PROFILE') }(P)
                </div>
                <div className='text-btn' onClick={ commandActions['w'] }>
                    { translation('MENU_WRITE') }(W)
                </div>
                <div className='text-btn' onClick={ commandActions['s'] }>
                    { translation('MENU_SEARCH') }(S)
                </div>
                <div className='text-btn hidden lg:block' onClick={ commandActions['l'] }>
                    { language === 'ko' ? '언어설정(L)' : 'Language(L)' }
                </div>
                <div className='text-btn' onClick={ commandActions['q'] }>
                    { user?.uid ? `${translation('MENU_LOGOUT')}(Q)` : `${translation('MENU_LOGIN')}(Q)` }
                </div> 
                
            </div>

            {/* 명령어 인풋 */}
            <div className="lg:p-5">
                <input 
                    type="text"
                    id='command'
                    onChange={ handleCommand }
                    onKeyUp={ handleCommandEnter }
                    value={ command }
                    placeholder={ terminalMessage }
                    className="text-input w-full truncate"
                />
            </div>
        </div>
    )
}