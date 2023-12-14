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
        <div className="flex gap-5 mb-12">
            <div className="user-img"></div>

            <div className="grow">
                {/* 게시글 프로필 */}
                <Link to={`/profile/${post?.uid}`}>
                <div className="flex mb-3 gap-3 lg:gap-5">
                    <div className="text-btn font-semibold truncate">
                        { post?.displayName || post?.email }
                    </div>
                    <div className="text-gray font-extralight">{ post?.createdAt }</div>
                </div>
                </Link>

                {/* 게시물 내용 */}
                <div className="text-btn pb-8">
                    <Link to={`/post/${post?.id}`}>{ post?.content }</Link>
                </div>
                

                <div className="flex justify-between">
                    <div className="flex gap-3">
                        <div>{ translation('LIKE') } : { post?.likeCount || 0 }</div>
                        <div>{ translation('COMMENT') } : { post?.comments?.length || 0 }</div>
                    </div>

                    {/* 게시글 유틸박스 */}
                    { post?.uid === user?.uid && // 게시글과 로그인정보가 일치할때만 렌더링
                    <div className="flex gap-3">
                        <Link to={`/post/edit/${post?.id}`}>{ translation('EDIT') }</Link>
                        <div className="delete-btn" onClick={ handlePostDelete }>
                            { translation('DELETE') }
                        </div>
                    </div> }
                </div>
            </div>
        </div>
    )
}