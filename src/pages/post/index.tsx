import CommentForm from "components/comment/CommentForm"
import CommentItem from "components/comment/CommentItem"
import { Link, useParams } from "react-router-dom"


export default function PostPage() {
    const { id } = useParams()

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
                        <div className="post__name">qdwe@naver.ocm</div>
                        <div className="post__createdAt">2023년 12월 16일</div>
                    </div>
                    </Link>

                    <div className="post__content">
                        <div className="post__text">하이요</div>
                    </div>

                    <div className="post__footer">
                        <div className="post__flex">
                            <div className="post__like">추천 : 0</div>
                            <div>덧글 : 0</div>
                        </div>
                        <div className="post__flex">
                            <div className="post__edit">
                                <Link to={`/post/edit/${1}`}>편집</Link>
                            </div>
                            <div className="post__delete">삭제</div>
                        </div> 
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