import styles from './postItem.module.scss'
import { Link } from "react-router-dom"
// 데이터 타입
import { PostType } from "interface"


interface PostItemProps {
    post : PostType
}

export default function PostItem({ post } : PostItemProps) {

    return (
        <div className={ styles.postItem }>
            <div className={ styles.postItem__userImg }></div>
            <div className={ styles.postItem__box }>
                <Link to={`/profile/${post?.id}`}>
                <div className={ styles.postItem__header }>
                    <div className={ styles.postItem__name }>{ post?.email }</div>
                    <div className={ styles.postItem__createdAt }>{ post?.createdAt }</div>
                </div>
                </Link>

                <Link to={`/post/${post?.id}`}>
                <div className={ styles.postItem__content }>
                    {/* 게시물 내용 */}
                    <div className={ styles.postItemt__text }>{ post?.content }</div>
                </div>
                </Link>

                <div className={ styles.postItem__footer }>
                    <div className={ styles.postItem__flex }>
                        <div>추천 : 0</div>
                        <div>덧글 : 0</div>
                    </div>
        
                    <div className={ styles.postItem__flex }>
                        <div>
                            <Link to={`/post/edit/${post?.id}`}>편집</Link>
                        </div>
                        <div className={ styles.postItem__delete }>삭제</div>
                    </div> 
                </div>
            </div>
        </div>
    )
}