import styles from './Comment.module.scss'
import { useContext, useState } from 'react'
import AuthContext from 'context/AuthContext'
import { arrayUnion, doc, updateDoc } from 'firebase/firestore'
import { db } from 'firebaseApp'
// 데이터타입
import { PostType } from 'interface'
// hooks
import useNotification from 'hooks/useNotification'


interface CommentFormProps {
    post : PostType,
}

export default function CommentForm({ post } : CommentFormProps) {
    const { user } = useContext(AuthContext)
    const [ content, setContent ] = useState<string>('')
    const { createNotification } = useNotification({ targetUid : post?.uid })

    // submit 핸들러
    const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        e?.preventDefault()

        try {
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

            // 게시글 comments필드에 댓글추가
            await updateDoc(postRef, {
                comments : arrayUnion(insertComment)
            })

            if(post?.uid !== user?.uid) {
                await createNotification('회원님 게시글에 덧글이 생성되었습니다.', `/post/${post?.id}`)
            }

            setContent('') // 댓글작성후, content초기화
            console.log('덧글을 작성하였습니다.')

        } catch(err : any) {
            console.log(err?.code)
        }
    }

    // content 핸들러
    const handleContentChange = (e : React.ChangeEvent<HTMLTextAreaElement>) => {
        const { value } = e?.target;
        setContent(value)
    }

    
    return (
        <form onSubmit={ handleSubmit } className={ styles.commentForm }>
            <textarea 
                className={ styles.commentForm__textarea }
                onChange={ handleContentChange }
                value={ content }
                placeholder={ user?.uid ? '덧글을 입력하십시오.' : '접속이후 이용해주십시오.' }
                disabled={ !user?.uid }
                spellCheck={false}
            />
            <div className={ styles.commentForm__flexReverse }>
                <input type='submit' value="덧글 남기기" className={ styles.commentForm__inputBtn }
                    disabled={!(user?.uid && content)}/>
            </div>
        </form>
    )
}