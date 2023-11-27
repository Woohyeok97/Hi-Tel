export default function EditProfilePage() {

    return (
        <div className="page">
            <div className="page__header">
                <h1>회원정보 편집</h1>
            </div>

            <form className="form">
                <div className="form__block">
                <label htmlFor="name">이름편집</label>
                    <input 
                        type="text" 
                        name="name" 
                        id="name" 
                        className="form__input"
                    />
                </div>

                <div className="form__submit">
                    <input type="submit" value="회원정보 편집" className="form__input-btn"/>
                </div>
            </form>
        </div>
    )
}