import { useCallback, useContext, useEffect, useState } from "react"
import AuthContext from "context/AuthContext"
import { Link, useNavigate, useParams } from "react-router-dom"
import { deleteDoc, doc, onSnapshot } from "firebase/firestore"
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

    useEffect(() => {
        if(id) fetchPost()
    }, [fetchPost, id])


    return (
        <div className="page">
            <div className="page__header">
                <h1>게시물</h1>
            </div>

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
                            <div className="post__like">
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
                <CommentForm/>
            </div>
        </div>
    )

    // return (
    //     <div className="page">
    //         <div className="page__header">
    //             <h1>게시물</h1>
    //         </div>

    //         <div className="post">
    //             <div className="post__header">
    //                 <div className="post__user-img"></div>
    //                 <div>
    //                     <div className="post__name">글쓴이 : </div>
    //                     <div className="post__created">날짜 : </div>
    //                 </div>
    //             </div>

    //             <div className="post__content">
    //                 <div className="post__text">하이요</div>
    //             </div>

    //             <div className="post__footer">
    //                 <div className="post__flex">
    //                     <div className="post__like">
    //                         추천 : 0
    //                     </div>
    //                     <div>덧글 : 0</div>
    //                 </div>
    //                 <div className="post__flex">
    //                     <div className="post__edit">
    //                         <Link to={`/post/edit/${1}`}>편집</Link>
    //                     </div>
    //                     <div className="post__delete">삭제</div>
    //                 </div> 
    //             </div>
    //         </div>

    //         <div>
    //             <div>
    //                 <CommentItem/>
    //                 <CommentItem/>
    //                 <CommentItem/>
    //             </div>
    //             <CommentForm/>
    //         </div>
            
    //     </div>
    // )
}