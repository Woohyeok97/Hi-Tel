import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "react-query"
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
    const queryClient = useQueryClient()
    // const [ prevPost, setPrevPost ] = useState<PostType | null>(null)
    const [ content, setContent ] = useState<string>('')
    const [ hashTagList, setHashTagList ] = useState<string[]>([])
    // 입력중인 해쉬태그
    const [ hashTag, setHashTag ] = useState<string>('')
    const navigate = useNavigate()
    const { translation } = useTranslation()


    // 기존 게시글 요청함수
    const fetchPrevPost = async () => {
        if(id) {
            const postRef = doc(db, 'posts', id)
            const result = await getDoc(postRef)

            return result
        }
    }

    const { data : prevPost, isError, error, isLoading } = useQuery('prevPost', fetchPrevPost, {
        enabled : !!id,
        refetchOnWindowFocus : false,
        staleTime : 1000,
    })

    // 게시글 수정 뮤테이션
    const mutation = useMutation({
        mutationFn : async (id : string) => {
            const postRef = doc(db, 'posts', id)
            await updateDoc(postRef, {
                content : content,
                hashTag : hashTagList, 
            })
        }, 
        onSuccess : () => {
            navigate('/')
            queryClient.invalidateQueries('prevPost')
            console.log('게시글을 편집하셨습니다.')
        },
        onError : (err : any) => {
            console.log(err?.code)
        }
    })

    // submit 핸들러
    const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        e?.preventDefault()

        if(prevPost?.id) {
            mutation.mutate(prevPost?.id)
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

    // prevPost로 상태업데이트(페칭한 or 캐싱된 데이터사용)
    useEffect(() => {
        if(prevPost?.id && prevPost?.data()?.uid !== user?.uid) {
            alert('너 누구야')
            navigate('/')
            return
        }
        setContent(prevPost?.data()?.content)
        setHashTagList(prevPost?.data()?.hashTag)
        
    }, [prevPost?.id])


    if(isLoading) return (
        <div>기다려주셈</div>
    )

    if(isError) {
        console.log(error)

        return <div>에러남</div>    
    }


    return (
        <form onSubmit={ handleSubmit } className="flex flex-col gap-3">
            <textarea 
                id='content'
                className="textarea grow min-h-[360px]"
                onChange={ handleContentChange }
                value={ content }
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
                    value={ translation('EDIT') } 
                    className="submit-btn py-3 px-5" 
                    disabled={ !content }
                />
            </div>
        </form>
    )
}