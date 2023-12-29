import { useContext, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import AuthContext from 'context/AuthContext'
import { arrayUnion, doc, updateDoc } from 'firebase/firestore'
import { db } from 'firebaseApp'
// 데이터타입
import { PostType } from 'interface'
// hooks
import useNotification from 'hooks/useNotification'
import useTranslation from 'hooks/useTranslation'


interface CommentFormProps {
    post : PostType,
}

export default function CommentForm({ post } : CommentFormProps) {
    const { user } = useContext(AuthContext)
    const [ content, setContent ] = useState<string>('')
    const queryClient = useQueryClient()
    const { createNotification } = useNotification({ targetUid : post?.uid })
    const { translation } = useTranslation()

    
    const commentMutation = useMutation({
        mutationFn : async () => {
            const postRef = doc(db, 'posts', post?.id)
            const insertComment = {
                uid : user?.uid,
                displayName : user?.displayName,
                email : user?.email,
                content : content,
                createdAt : new Date().toLocaleDateString("ko", {
                    hour : '2-digit',
                    minute : '2-digit',
                    second : '2-digit'
                }), 
            }
            await updateDoc(postRef, {
                comments : arrayUnion(insertComment)
            })
        },
        onSuccess : async () => {
            if(post?.uid !== user?.uid) {
                await createNotification('회원님 게시글에 덧글이 생성되었습니다.', `/post/${post?.id}`)
            }
            
            setContent('') // 댓글작성후, content초기화
            
            queryClient.invalidateQueries({ queryKey : [`post-${post?.id}`] })
            console.log('덧글을 작성하였습니다.')
        },
        onError : (err : any) => {
            console.log(err?.code)
        }
    })

    // submit 핸들러
    const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        e?.preventDefault()
        commentMutation.mutate()
    }

    // content 핸들러
    const handleContentChange = (e : React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e?.target;
        setContent(value)
    }

    
    return (
        <form onSubmit={ handleSubmit } className="flex flex-col items-end mb-10">
            <textarea 
                className="p-3 text-white bg-darkBlue w-full"
                onChange={ handleContentChange }
                value={ content }
                placeholder={ user?.uid ? '덧글을 입력하십시오.' : '접속이후 이용해주십시오.' }
                disabled={ !user?.uid }
                spellCheck={false}
            />
            <input 
                type='submit'
                value={ translation('COMMENT') } 
                className="submit-btn py-3 px-5"
                disabled={!(user?.uid && content)}
            />
        </form>
    )
}