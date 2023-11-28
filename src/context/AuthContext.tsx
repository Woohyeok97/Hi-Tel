import { ReactNode, createContext, useEffect, useState } from "react";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "firebaseApp";

// 로그인정보를 context로 전역관리
const AuthContext = createContext({
    user : null as User | null,
    init : false,
})


interface ProviderProps {
    children : ReactNode,
}

// 프로바이더
export function AuthContextProvider({ children } : ProviderProps) {
    const [ currentUser, setCurrentUser ] = useState<User | null>(null)
    const [ init, setInit ] = useState<boolean>(false)
    const auth = getAuth(app)

    // onAuthStateChanged()함수로 auth의 상태를 추적해서 currentUser에 할당
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if(user) {
                setCurrentUser(user)
            } else {
                setCurrentUser(null)
            }
            setInit(true)
        })
    }, [auth]) // auth가 변경될때마다 실행

    return (
        <AuthContext.Provider value={{ user : currentUser, init : init }}>
            { children }
        </AuthContext.Provider>
    )
}

export default AuthContext;