import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import AuthContext from "context/AuthContext"
import { addDoc, collection } from "firebase/firestore"
import { db } from "firebaseApp"


export default function PostForm() {
    const { user } = useContext(AuthContext)
    const [ content, setContent ] = useState<string>('')
    const [ hashTagList, setHashTagList ] = useState<string[]>([])
    // 입력중인 해쉬태그
    const [ hashTag, setHashTag ] = useState<string>('')
    const navigate = useNavigate()


    // submit 핸들러
    const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        e?.preventDefault()

        try {
            const postRef = collection(db, 'posts')
            const insertPost = {
                uid : user?.uid,
                displayName : user?.displayName,
                email : user?.email,
                content : content,
                hashTag : hashTagList, 
                createdAt : new Date().toLocaleDateString("ko", {
                    hour : '2-digit',
                    minute : '2-digit',
                    second : '2-digit'
                }),         
            }
            // 게시글 업로드
            await addDoc(postRef, insertPost)

            navigate('/')
            console.log('게시글을 작성하셨습니다.')
        } catch(err : any) {
            console.log(err?.code)
        }
    }

    // content 핸들러
    const handleContentChange = (e : React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e?.target;
        setContent(value)
    }

    // hashTag 핸들러
    const handleHashTagChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e?.target;
        setHashTag(value.trim())
    }

    // hashTag삭제 핸들러
    const handleHashTagDelete = (e : any) => {
        const { id } = e?.target;
        setHashTagList((prev) => prev.filter((item) => item !== id))
    }

    // 해쉬태그 추가 핸들러
    const handleAddHashTag = (e : any) => {
        const SPACE_KEY_CODE = 32 // 스페이스바 키코드
        // 스페이스바를 입력하면 입력중인 해쉬태그를 해쉬태그리스트에 추가
        if(hashTag && e?.keyCode === SPACE_KEY_CODE) {

            // 해쉬태그 추가 유효성검사
            if(hashTagList.length >= 3) {
                console.log('해쉬태그는 3개까지만 입력하십시오.')
            } else if(hashTagList.includes(hashTag)) {
                console.log('이미 입력하셨습니다.')
            } else {
                setHashTagList((prev) => [...prev, hashTag.trim()])
            }
            setHashTag('')
        }  
    }


    return (
        <form onSubmit={ handleSubmit } className="form">
            <div className="form__block">
                <textarea 
                    id='content'
                    className="form__textarea"
                    onChange={ handleContentChange }
                    spellCheck={false}
                    placeholder="> 내용을 입력해주세요."
                />
            </div>
        
            <div className="form__block">
                <div className="form__hashTag-area">
                { hashTagList?.length > 0 && hashTagList?.map((item) => 
                    <span key={item} id={item} onClick={ handleHashTagDelete } className="form__hashTag">
                        #{ item }
                    </span> )}
                    
                    <input
                        type='text'
                        className="form__input"
                        onChange={ handleHashTagChange }
                        onKeyUp={ handleAddHashTag }
                        value={ hashTag }
                        placeholder='> 해쉬태그 + 스페이스바 (최대 3개)'
                    />
                </div>
            </div>

            <div className="form__submit">
                <input type="submit" value="글작성" className="form__input-btn" disabled={ !content }/>
            </div>
        </form>
    )
}