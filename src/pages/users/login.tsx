import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GithubAuthProvider, GoogleAuthProvider, User, getAuth, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { app, db } from "firebaseApp";
import useTranslation from "hooks/useTranslation";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";


export default function LoginPage() {
    const [ email, setEmail ] = useState<string>('')
    const [ password, setPassword  ] = useState<string>('')
    const { translation } = useTranslation()
    const navigate = useNavigate()

    // submit 핸들러
    const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        e?.preventDefault()
        // 이메일, 비밀번호 유효성검사
        if(!email || !password) {
            console.log('입력을 확인해주십시오.')
            return
        }

        try {
            const auth = getAuth(app)
            // 로그인
            await signInWithEmailAndPassword(auth, email, password)

            navigate('/')
            console.log('접속하셨습니다.')
        } catch(err : any) {
            console.log(err?.code)
        }
    }

    // 폼 핸들러
    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e?.target;

        if(name === 'email') {
            setEmail(value?.trim())
        }
        if(name === 'password') {
            setPassword(value?.trim())
        }
    }

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

    return (
        <div className="page">
            <div className="page__title">{ translation('MENU_LOGIN') }</div>

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
                    <Link to="/users/signup" className="form__link">
                        도움말) 신규/무료가입을 원하시면 클릭하십시오.
                    </Link> 
                </div>

                <div className="form__submit">
                    <input type="submit" value={ translation('MENU_LOGIN') } className="form__input-btn"/>
                </div>

                <div className="form__block">
                    <div className="form__flex">
                        <div id="github" onClick={ handleSocialLogin }>{ translation('GITHUB') }?</div>
                        <div>or</div>
                        <div id="google" onClick={ handleSocialLogin }>{ translation('GOOGLE') }?</div>
                    </div>
                </div>
            </form>
        </div>
    )
}