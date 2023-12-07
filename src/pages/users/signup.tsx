import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GithubAuthProvider, GoogleAuthProvider, User, createUserWithEmailAndPassword, getAuth, signInWithPopup } from "firebase/auth";
import { app, db } from "firebaseApp";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
// hooks
import useTranslation from "hooks/useTranslation";


export default function SignupPage() {
    const [ email, setEmail ] = useState<string>('')
    const [ password, setPassword  ] = useState<string>('')
    const [ passwordConfirm, setPasswordConfirm ] = useState<string>('')
    const [ errorMessage, setErrerMessage ] = useState<string>('')
    const { translation } = useTranslation()
    const navigate = useNavigate()

    // 기존프로필 확인 함수
    const checkPrevProfile = async (uid : string) => {
        const profileRef = collection(db, 'profiles')
        const profileQuery = query(profileRef, where('uid', '==', uid))
        const result = await getDocs(profileQuery)

        // 기존 profile 콜렉션에 로그인하는 유저 프로필이 있는지 확인 
        return !result?.empty
    }

    // 프로필 생성 함수
    const createProfile = async (user : User) => {
        const profileRef = doc(db, 'profiles', user?.uid)
        const insertData = {
            displayName : user?.displayName,
            email : user?.email,
            photoURL : user?.photoURL,
            createdAt : new Date().toLocaleDateString("ko", {
                hour : '2-digit',
                minute : '2-digit',
                second : '2-digit'
            })
        }
        await setDoc(profileRef, insertData)
    }

    // submit핸들러
    const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        e?.preventDefault();
        // 폼 데이터 유효성 검사
        if(!email || !password || !passwordConfirm) {
            console.log('입력을 확인해주십시오.')
            return
        }

        try {
            const auth = getAuth(app)
            // 회원가입(유저생성)
            const result = await createUserWithEmailAndPassword(auth, email, password)
            // 프로필 생성(생성된 유저정보 이용)
            await createProfile(result.user)

            navigate('/')
            console.log('가입을 환영합니다.')
        } catch(err : any) {
            console.log(err?.code)
        }
    }

    // 소셜 로그인
    const handleSocialLogin = async (e : any) => {
        const { id } = e?.target;

        try {
            const auth = getAuth(app)
            let provider;

            if(id === 'github') {
                provider = new GithubAuthProvider()
            }
            if(id === 'google') {
                provider = new GoogleAuthProvider()
            } 

            const result = await signInWithPopup(auth, provider as GithubAuthProvider | GoogleAuthProvider)
            const prevProfile = await checkPrevProfile(result?.user?.uid)

            if(!prevProfile) {
                await createProfile(result.user)
            }
            
            navigate('/')
            console.log('가입을 환영합니다.')
        } catch(err : any) {
            console.log(err?.code)
        }
    }


    // 폼 핸들러
    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e?.target;
        // 이메일 정규식
        const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        let errerMessage = ''

        // 해당 name외에도 유효성검사 실행
        if(name === 'email') { 
            setEmail(value?.trim())
            // 유효성 검사
            if(!value?.match(validRegex)) {
                errerMessage = '이메일 형식으로 입력해주십시오.'
            } else if(password.length < 8) {
                errerMessage = '비밀번호는 8자리 이상이 국룰입니다.'
            } else if(password !== passwordConfirm) {
                errerMessage = '비밀번호를 확인해주십시오.'
            }
        }
        if(name === 'password') {
            setPassword(value?.trim())
            // 유효성 검사
            if(value?.trim().length < 8) {
                errerMessage = '비밀번호는 8자리 이상이 국룰입니다.'
            } else if(value?.trim() !== passwordConfirm) {
                errerMessage = '비밀번호를 확인해주십시오.'
            } else if(!email.match(validRegex)) {
                errerMessage = '이메일 형식으로 입력해주십시오.'
            }
        }
        if(name === 'passwordConfirm') {
            setPasswordConfirm(value?.trim())
            // 유효성 검사
            if(value?.trim() !== password) {
                errerMessage = '비밀번호를 확인해주십시오.'
            } else if(password.length < 8) {
                errerMessage = '비밀번호는 8자리 이상이 국룰입니다.'
            } else if(!email.match(validRegex)) {
                errerMessage = '이메일 형식으로 입력해주십시오.'
            }
        }
        setErrerMessage(errerMessage)
    }


    return (
        <div className="page">
            <div className="page__title">{ translation('MENU_SIGNUP') }</div>

            <form onSubmit={ handleSubmit } className="form">
                <div className="form__block">
                    <div className="form__block">
                        <label htmlFor="email">{ translation('EMAIL') }</label>
                    </div>
                    <input 
                        type="email" 
                        name="email"
                        id="email" 
                        onChange={ handleChange } 
                        className="form__input"
                    />
                </div>

                <div className="form__block">
                    <div className="form__block">
                        <label htmlFor="password">{ translation('PASSWORD') }</label>
                    </div>
                    <input 
                        type="password" 
                        name="password" 
                        id="password"
                        onChange={ handleChange } 
                        className="form__input"
                    />
                </div>

                <div className="form__block">
                    <div className="form__block">
                        <label htmlFor="passwordConfirm">{ translation('PASSWORD_CONFIRM') }</label>
                    </div>
                    <input 
                        type="password" 
                        name="passwordConfirm" 
                        id="passwordConfirm" 
                        onChange={ handleChange } 
                        className="form__input"
                    />
                </div>

                <div className="form__block">
                    <Link to="/users/login" className="form__link">
                        도움말) 기존회원이라면 클릭하십시오.
                    </Link> 
                </div>

                <div className="form__block">
                { errorMessage && <div className="form__error">안내) { errorMessage }</div> }
                </div>

                <div className="form__submit">
                    <input type="submit" value={ translation('MENU_SIGNUP') } className="form__input-btn"
                    disabled={!!errorMessage}/>
                </div>

                {/* 소셜 로그인 */}
                <div className="form__block">
                    <div className="form__flex">
                        <div id="github" onClick={ handleSocialLogin }>
                        { translation('GITHUB') }?
                        </div>
                        <div>or</div>
                        <div id="google" onClick={ handleSocialLogin }>
                        { translation('GOOGLE') }
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}