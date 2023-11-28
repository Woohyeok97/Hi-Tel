import { useCallback, useContext, useEffect, useState } from "react"
import AuthContext from "context/AuthContext"
import { Link, useNavigate, useParams } from "react-router-dom"
import { arrayRemove, arrayUnion, deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore"
import { db } from "firebaseApp"
// components
import CommentForm from "components/comment/CommentForm"
import CommentItem from "components/comment/CommentItem"
// 데이터 타입
import { PostType } from "interface"


export default function PostPage() {
    const { user } = useContext(AuthContext)
    const { id } = useParams()
    const [ post, setPost ] = useState<PostType | null>(null)
    const navigate = useNavigate()
    
    // 게시글 요청 핸들러 (실시간 댓글추적을 위해 onSanpshot, useCallback사용)
    const fetchPost = useCallback(async () => {
        if(id) {
            try {
                const postRef = doc(db, 'posts', id)
                onSnapshot(postRef, (snapshot) => {
                    const result = { id : snapshot?.id, ...snapshot?.data() }
                    setPost(result as PostType)
                })
            } catch(err : any) {
                console.log(err?.code)
            }
        }
    }, [id])

    // 게시글 삭제 핸들러
    const handlePostDelete = async () => {
        const confirm = window.confirm('삭제하시겠습니까?')

        if(confirm && post && post?.uid === user?.uid) {
            try {
                const postRef = doc(db, 'posts', post?.id)
                await deleteDoc(postRef)

                navigate('/')
                console.log('삭제하셨습니다.')
            } catch(err : any) {
                console.log(err?.code)
            }
        }
    }

    // 게시글 추천 핸들러
    const handleLikePost = async () => {
        if(!user?.uid) {
            console.log('접속이후 이용해주십시오.')
            return
        }
        if(post?.id) {
            try {
                const postRef = doc(db, 'posts', post?.id)

                // 기존에 좋아요를 누른적이 있다면, 좋아요 취소
                if(post?.likes?.includes(user?.uid)) {
                    await updateDoc(postRef, {
                        likes : arrayRemove(user?.uid),
                        likeCount : post?.likeCount ? post?.likeCount - 1 : 0
                    })
                    console.log('추천을 취소하셨습니다.')

                // 기존에 좋아요를 누른적이 없다면, 좋아요
                } else {
                    await updateDoc(postRef, {
                        likes : arrayUnion(user?.uid),
                        likeCount : post?.likeCount ? post?.likeCount + 1 : 1
                    })
                    console.log('게시글을 추천하셨습니다.')
                }        
            } catch(err : any) {
                console.log(err?.code)
            }
        }
    }

    useEffect(() => {
        if(id) fetchPost()
    }, [fetchPost, id])


    return (
        <div className="page">
            <div className="page__header">
                <h1>게시물</h1>
            </div>

            { post?.id && <> 
            <div className="post">
                <div className="post__user-img"></div>

                <div className="post__box">
                    <Link to={`/profile/${1}`}>
                    <div className="post__header">
                        <div className="post__name">{ post?.displayName || post?.email }</div>
                        <div className="post__createdAt">{ post?.createdAt }</div>
                    </div>
                    </Link>

                    <div className="post__content">
                        <div className="post__text">{ post?.content }</div>
                    </div>

                    <div className="post__footer">
                        <div className="post__flex">
                            <div 
                                className={`post__like ${ user?.uid && post?.likes?.includes(user?.uid) && 'post__like--active' }`} 
                                onClick={ handleLikePost }>
                                추천 : { post?.likeCount || 0 }
                            </div>
                            <div>덧글 : 0</div>
                        </div>

                        { post?.uid === user?.uid && // 게시글과 로그인정보가 일치할때만 렌더링
                        <div className="post__flex">
                            <Link to={`/post/edit/${post?.id}`}>편집</Link>
                            <div className="post__delete" onClick={ handlePostDelete }>삭제</div>
                        </div> }
                    </div>
                </div>
            </div> 

            <div className="comment">
                <div>
                    <CommentItem/>
                    <CommentItem/>
                    <CommentItem/>
                </div>
                <CommentForm post={ post }/>
            </div> 
            </> }

        </div>
    )
}