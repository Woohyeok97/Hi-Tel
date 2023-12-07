import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import AuthContext from "context/AuthContext"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "firebaseApp"
// 데이터 타입
import { PostType } from "interface"
// hooks
import useTranslation from "hooks/useTranslation"


export default function PostEditForm() {
    const { user } = useContext(AuthContext)
    const { id } = useParams()
    // 기존게시물
    const [ prevPost, setPrevPost ] = useState<PostType | null>(null)
    const [ content, setContent ] = useState<string>('')
    const [ hashTagList, setHashTagList ] = useState<string[]>([])
    // 입력중인 해쉬태그
    const [ hashTag, setHashTag ] = useState<string>('')
    const navigate = useNavigate()
    const { translation } = useTranslation()

    // 기존게시물 요청 함수
    const fetchPrevPost = async (id : string) => {
        try {
            const postRef = doc(db, 'posts', id)
            const result = await getDoc(postRef)

            // 게시물과 로그인정보가 일치하는지 확인
            if(result.data()?.uid !== user?.uid) {
                alert('너 누구야')
                navigate('/')
            } else {
                setPrevPost({ ...result.data() as PostType, id : result.id })
                setContent(result.data()?.content)
                setHashTagList(result.data()?.hashTag)
            }
        } catch(err : any) {
            console.log(err?.code)
        }
    }

    // submit 핸들러
    const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        e?.preventDefault()

        if(prevPost?.id) {
            try {
                const postRef = doc(db, 'posts', prevPost?.id)
                // 게시글 수정
                await updateDoc(postRef, {
                    content : content,
                    hashTag : hashTagList, 
                })
    
                navigate('/')
                console.log('게시글을 편집하셨습니다.')
            } catch(err : any) {
                console.log(err?.code)
            }
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

    // 기존게시물 요청(id가 있을때만)
    useEffect(() => {
        if(id) fetchPrevPost(id)
    }, [id])

    return (
        <> { prevPost &&  // prevPost가 준비되면 렌더링
        <form onSubmit={ handleSubmit } className="form">
            {/* 글입력 */}
            <div className="form__block">
                <textarea 
                    id='content'
                    className="form__textarea"
                    onChange={ handleContentChange }
                    value={ content }
                    spellCheck={false}
                    placeholder="> 내용을 입력해주세요."
                />
            </div>

            <div className="form__block">
                <div className="form__hashTag-area">
                    {/* 해쉬태그 */}
                { hashTagList?.length > 0 && hashTagList?.map((item) => 
                    <span key={item} id={item} onClick={ handleHashTagDelete } className="form__hashTag">
                        #{ item }
                    </span> )}
                    
                    {/* 해쉬태그 입력 */}
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
                <input type="submit" value={ translation('EDIT') } className="form__input-btn" disabled={ !content }/>
            </div>
        </form> } </>
    )
}