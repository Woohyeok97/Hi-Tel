export default function EditPostPage() {

    return (
        <div className="page">
            <div className="page__header">
                <h1>글편집</h1>
            </div>

            <form className="form">
                <div className="form__block">
                    <textarea 
                        id='content'
                        className="form__textarea"
                        spellCheck={false}
                        placeholder="> 내용을 입력해주세요."
                    />
                </div>
            
                <div className="form__block">
                    <input
                        type='text'
                        className="form__input"
                        placeholder='> 해쉬태그 + 스페이스바 (최대 3개)'
                    />
                </div>

                <div className="form__submit">
                    <input type="submit" value="글편집" className="form__input-btn"/>
                </div>
            </form>
        </div>
    )
}