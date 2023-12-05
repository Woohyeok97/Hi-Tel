import styles from './Comment.module.scss'
import { useContext } from 'react'
import AuthContext from 'context/AuthContext'
import { Link } from 'react-router-dom'
// hooks
import useTranslation from 'hooks/useTranslation'
// 데이터타입
import { CommentType, PostType } from 'interface'
import { arrayRemove, doc, updateDoc } from 'firebase/firestore'
import { db } from 'firebaseApp'



interface CommentItemProps {
    comment : CommentType,
    post : PostType,
}

export default function CommentItem({ comment, post } : CommentItemProps) {
    const { user } = useContext(AuthContext)
    const { translation } = useTranslation()

    // 댓글삭제 핸들러
    const handleCommentDelete = async () => {
        const confirm = window.confirm('삭제하시겠습니까?')
        
        if(confirm && comment?.uid === user?.uid) {
            try {
                const postRef = doc(db, 'posts', post?.id)
                await updateDoc(postRef, {
                    comments : arrayRemove(comment)
                })
    
                console.log('덧글을 삭제하였습니다.')
            } catch(err : any) {
                console.log(err?.code)
            }
        }
    }

    return (
        <div className={ styles.commentItem }>
            <div className={ styles.commentItem__flex }>
                <div className={ styles.commentItem__userImg }></div>
                <div>
                    <Link to={`/profile/${comment?.uid}`}>
                    <div className={ styles.commentItem__header }>
                        <div className={ styles.commentItem__name }>
                            { comment?.displayName || comment?.email }
                        </div>
                        <div className={ styles.commentItem__createdAt }>{ comment?.createdAt }</div>
                    </div>
                    </Link>

                    <div className={ styles.commentItem__content }>{ comment?.content }</div>
                </div>
            </div>
    
            { comment?.uid === user?.uid && 
            <div className={ styles.commentItem__delete } onClick={ handleCommentDelete }>
                { translation('DELETE') }
            </div> }
        </div>
    )
}