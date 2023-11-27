import styles from './Comment.module.scss'

export default function CommentForm() {

    return (
        <form className={ styles.commentForm }>
            <textarea 
                className={ styles.commentForm__textarea }
                placeholder='덧글을 입력하십시오.'
                spellCheck={false}
            />
            <div className={ styles.commentForm__flexReverse }>
                <input type='submit' value="덧글 남기기" className={ styles.commentForm__inputBtn }/>
            </div>
        </form>
    )
}