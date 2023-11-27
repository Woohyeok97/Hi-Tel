import { Link } from "react-router-dom";

export default function LoginPage() {

    return (
        <div className="page">
            <div className="page__header">
                <h1>접속화면</h1>
            </div>

            <form className="form">
                <div className="form__block">
                    <label htmlFor="email">아이디</label>
                    <input 
                        type="email" 
                        name="email"
                        id="email" 
                        className="form__input"
                    />
                </div>

                <div className="form__block">
                    <label htmlFor="password">비밀번호</label>
                    <input 
                        type="password" 
                        name="password" 
                        id="password" 
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