import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import AuthContext from "context/AuthContext"
import { addDoc, collection } from "firebase/firestore"
import { db } from "firebaseApp"
// hooks
import useTranslation from "hooks/useTranslation"


export default function PostForm() {
    const { user } = useContext(AuthContext)
    const [ content, setContent ] = useState<string>('')
    const [ hashTagList, setHashTagList ] = useState<string[]>([])
    // 입력중인 해쉬태그
    const [ hashTag, setHashTag ] = useState<string>('')
    const navigate = useNavigate()
    const { translation } = useTranslation()

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
        <form onSubmit={ handleSubmit } className="flex flex-col gap-3">
            <textarea 
                id='content'
                className="textarea grow min-h-[360px]"
                onChange={ handleContentChange }
                spellCheck={false}
                placeholder="내용을 입력해주십시오."
            />
        
            {/* 해쉬태그 */}
            <div className="bg-darkBlue">
                { hashTagList?.length > 0 && 
                <div className="pt-4 px-4">
                    { hashTagList?.map((item) => 
                    <span key={item} id={item} className="hash-tag text-btn hover:text-warningHover"
                        onClick={ handleHashTagDelete }>
                        #{ item }
                    </span> )}
                </div> }

                <input
                    type='text'
                    className="text-input"
                    onChange={ handleHashTagChange }
                    onKeyUp={ handleAddHashTag }
                    value={ hashTag }
                    placeholder='> 해쉬태그 + 스페이스바 (최대 3개)'
                />
            </div>

            <div className="flex flex-row-reverse">
                <input
                    type="submit" 
                    value={ translation('MENU_WRITE') } 
                    className="submit-btn py-3 px-5" 
                    disabled={ !content }
                />
            </div>
        </form>
    )
}