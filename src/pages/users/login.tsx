import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "firebaseApp";


export default function LoginPage() {
    const [ email, setEmail ] = useState<string>('')
    const [ password, setPassword  ] = useState<string>('')
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

    return (
        <div className="page">
            <div className="page__header">
                <h1>접속화면</h1>
            </div>

            <form onSubmit={ handleSubmit } className="form">
                <div className="form__block">
                    <label htmlFor="email">아이디</label>
                    <input 
                        type="email" 
                        name="email"
                        id="email" 
                        onChange={ handleChange }
                        className="form__input"
                    />
                </div>

                <div className="form__block">
                    <label htmlFor="password">비밀번호</label>
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
                    <input type="submit" value="접속 요청" className="form__input-btn"/>
                </div>

                <div className="form__block">
                    <div className="form__flex">
                        <div>깃허브 접속</div>
                        <div>구글 접속</div>
                    </div>
                </div>
            </form>
        </div>
    )
}