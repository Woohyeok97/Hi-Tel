import styles from './PostItem.module.scss'
import { useContext } from 'react'
import AuthContext from 'context/AuthContext'
import { Link } from "react-router-dom"
// hooks
import useTranslation from 'hooks/useTranslation'
// 데이터 타입
import { PostType } from "interface"
import { deleteDoc, doc } from 'firebase/firestore'
import { db } from 'firebaseApp'


interface PostItemProps {
    post : PostType
}

export default function PostItem({ post } : PostItemProps) {
    const { user } = useContext(AuthContext)
    const { translation } = useTranslation()

    // 게시글 삭제 핸들러
    const handlePostDelete = async () => {
        const confirm = window.confirm('삭제하시겠습니까?')

        if(confirm && post?.uid === user?.uid) {
            try {
                const postRef = doc(db, 'posts', post?.id)
                await deleteDoc(postRef)

                console.log('삭제하셨습니다.')
            } catch(err : any) {
                console.log(err?.code)
            }
        }
    }

    return (
        <div className={ styles.postItem }>
            <div className={ styles.postItem__userImg }></div>

            <div className={ styles.postItem__box }>
                {/* 게시글 프로필 */}
                <Link to={`/profile/${post?.uid}`}>
                <div className={ styles.postItem__header }>
                    <div className={ styles.postItem__name }>{ post?.displayName || post?.email }</div>
                    <div className={ styles.postItem__createdAt }>{ post?.createdAt }</div>
                </div>
                </Link>

                {/* 게시물 내용 */}
                <Link to={`/post/${post?.id}`}>
                <div className={ styles.postItem__content }>
                    <div className={ styles.postItemt__text }>{ post?.content }</div>
                </div>
                </Link>

                <div className={ styles.postItem__footer }>
                    <div className={ styles.postItem__flex }>
                        <div>{ translation('LIKE') } : { post?.likeCount || 0 }</div>
                        <div>{ translation('COMMENT') } : { post?.comments?.length || 0 }</div>
                    </div>

                    {/* 게시글 유틸박스 */}
                    { post?.uid === user?.uid && // 게시글과 로그인정보가 일치할때만 렌더링
                    <div className={ styles.postItem__flex }>
                        <Link to={`/post/edit/${post?.id}`}>{ translation('EDIT') }</Link>
                        <div className={ styles.postItem__delete } onClick={ handlePostDelete }>
                            { translation('DELETE') }
                        </div>
                    </div> }
                </div>
            </div>
        </div>
    )
}