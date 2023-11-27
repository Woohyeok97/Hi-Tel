import styles from './Comment.module.scss'
import { Link } from 'react-router-dom'


export default function CommentItem() {

    return (
        <div className={ styles.commentItem }>
            <div className={ styles.commentItem__flex }>
                <div className={ styles.commentItem__userImg }></div>
                <div>
                    <Link to={`/`}>
                    <div className={ styles.commentItem__header }>
                        <div className={ styles.commentItem__name }>회원이름</div>
                        <div className={ styles.commentItem__createdAt }>2023.12.13</div>
                    </div>
                    </Link>

                    <div className={ styles.commentItem__content }>안녕하세요~</div>
                </div>
            </div>
    
            <div className={ styles.commentItem__delete }>삭제</div>
        </div>
    )
}