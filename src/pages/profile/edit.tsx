import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import AuthContext from "context/AuthContext"
import { updateProfile } from "firebase/auth"
import { collection, doc, getDocs, query, updateDoc, where, writeBatch } from "firebase/firestore"
import { db } from "firebaseApp"
// hooks
import useTranslation from "hooks/useTranslation"


export default function EditProfilePage() {
    const [ displayName, setDisplayName ] = useState<string>('')
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()
    const { translation } = useTranslation()

    // submit 핸들러
    const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        e?.preventDefault()

        if(!user?.uid) {
            alert('너 누구야')
            return
        }
        try {
            const profileRef = doc(db, 'profiles', user?.uid)
            const postsRef = collection(db, 'posts')
            const postsQuery = query(postsRef, where('uid', '==', user?.uid))
            // 우선 firebase Auth의 프로필 업데이트
            await updateProfile(user, {
                displayName : displayName || null, // displayName이 유효하지않으면 null 저장
            })
            // profiles콜렉션 업데이트
            await updateDoc(profileRef, {
                displayName : displayName || null, // displayName이 유효하지않으면 null 저장
            })
            // 해당유저가 작성했던 모든 게시글 이름변경
            const posts = await getDocs(postsQuery)
            const batch = writeBatch(db)

            // batch를 이용하여 유저가 작성한 게시글의 displayName 수정
            posts.forEach((doc) => {
                batch.update(doc.ref, {
                    displayName : displayName,
                })
            })
            // 수정후, batch commit
            await batch.commit()
            
            navigate(`profile/${user?.uid}`)
            console.log('회원정보를 편집하셨습니다.')
        } catch(err : any) {
            console.log(err?.code)
        }
    }

    // 이름변경 핸들러
    const handleNameChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e?.target;

        if(name === 'name') {
            setDisplayName(value?.trim())
        }
    }

    // 컴포넌트 등장시, displayName 변경(없다면 '' 할당)
    useEffect(() => {
        if(user?.uid) setDisplayName(user?.displayName || '')
    }, [user?.uid])


    return (
        <div className="page-container">
            <div className="page-header">{ translation('PROFILE_EDIT') }</div>

            <form onSubmit={ handleSubmit } className="flex flex-col pt-5 mb-10">
                <div className="mb-5">
                    <label htmlFor="name" className="font-bold block pb-3 pl-3">
                        { translation('PROFILE_EDIT_NAME') }
                    </label>
                    <input 
                        type="text" 
                        name="name" 
                        id="name" 
                        onChange={ handleNameChange }
                        value={ displayName }
                        placeholder={ !user?.displayName ? '이름을 설정하십시오.' : '' }
                        className="text-input w-full"
                    />
                </div>

                <div className="flex flex-row-reverse">
                    <input type="submit" value={ translation('PROFILE_EDIT') } className="submit-btn py-3 px-5"/>
                </div>
            </form>
        </div>
    )
}