import { useContext, useState } from "react"
import AuthContext from "context/AuthContext";


export default function SearchPage() {
    const { user } = useContext(AuthContext)
    const [ searchQuery, setSearchQuery ] = useState<string>('')
    
    // 검색쿼리 핸들러
    const handleQueryChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e?.target;
        setSearchQuery(value?.trim())
    }

    return (
        <div className="page">
            <div className="page__header">
                <h1>검색</h1>
            </div>

            <form className="form">
                <div className="form__block">
                    <input 
                        type="text" 
                        id="search"
                        className="form__input"
                        onChange={ handleQueryChange }
                        placeholder={ user?.uid ? "검색어를 입력하십시오." : "접속이후 이용해주십시오." }
                        disabled={ !user?.uid }
                    />
                </div>
            </form>

            <div className="search">
                <div className="search__tabs">
                    <div className={`search__tab ${'search__tab--active'}`}>게시물</div> 
                </div>

                <div className="search__list">

                </div>
            </div>
        </div>
    )
}