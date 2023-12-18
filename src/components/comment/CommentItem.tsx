import { useContext } from 'react'
import AuthContext from 'context/AuthContext'
import { Link } from 'react-router-dom'
// hooks
import useTranslation from 'hooks/useTranslation'
// 데이터타입
import { CommentType, PostType } from 'interface'
import { arrayRemove, doc, updateDoc } from 'firebase/firestore'
import { db } from 'firebaseApp'
import { useMutation, useQueryClient } from 'react-query'


interface CommentItemProps {
    comment : CommentType,
    post : PostType,
}

export default function CommentItem({ comment, post } : CommentItemProps) {
    const { user } = useContext(AuthContext)
    const queryClient = useQueryClient()
    const { translation } = useTranslation()

    // 댓글삭제
    const deleteMutation = useMutation({
        mutationFn : async () => {
            const confirm = window.confirm('삭제하시겠습니까?')

            if(confirm) {
                const postRef = doc(db, 'posts', post?.id)
                await updateDoc(postRef, {
                    comments : arrayRemove(comment)
                })
            }
        },
        onSuccess : () => {
            console.log('덧글을 삭제하였습니다.')
            queryClient.invalidateQueries(`post-${post?.id}`)
        },
        onError : (err : any) => {
            console.log(err?.code)
        }
    })


    return (
        <div className="flex gap-5 mb-12 mt-3">
            <div className="user-img"></div>

            <div className="grow">
                <div className="flex gap-5">
                    <div className='text-btn mb-1 font-semibold truncate'>
                        <Link to={`/profile/${comment?.uid}`}>
                            { comment?.displayName || comment?.email }
                        </Link>
                    </div>
                    
                    { comment?.uid === user?.uid && 
                    <div className="delete-btn" onClick={ () => deleteMutation.mutate() }>
                        { translation('DELETE') }
                    </div> }
                </div>

                <div className="mb-5">{ comment?.content }</div>
                <div className="text-gray font-extralight">
                    { comment?.createdAt }
                </div>
            </div>
        </div>
    )
}