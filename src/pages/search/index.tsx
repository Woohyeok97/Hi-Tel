import { useCallback, useContext, useEffect, useState } from "react"
import AuthContext from "context/AuthContext";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "firebaseApp";
import { PostType } from "interface";
import PostItem from "components/post/PostItem";


export default function SearchPage() {
    const { user } = useContext(AuthContext)
    const [ searchQuery, setSearchQuery ] = useState<string>('')
    const [ searchPosts, setSearchPost ] = useState<PostType[]>([])

    // 게시글 요청 함수
    const fetchPostList = async () => {
        const postsRef = collection(db, 'posts')
        // hashTag라는 필드(배열)에 searchQuery를 포함하고 있는 doc이 있는지
        const postsQuery = query(postsRef, where('hashTag', 'array-contains', searchQuery), orderBy('createdAt', "desc"))
        onSnapshot(postsQuery, (snapshot) => {
            const result = snapshot?.docs?.map((item) => ({ ...item?.data(), id : item?.id }))
            setSearchPost(result as PostType[])
        })
    }
    
    // 검색쿼리 핸들러
    const handleQueryChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e?.target;
        setSearchQuery(value?.trim())
    }

    // 검색결과(게시글) 가져오기(로그인상태일때만)
    useEffect(() => {
        if(user?.uid && searchQuery) fetchPostList()
    }, [user?.uid, searchQuery])


    return (
        <div className="page">
            <div className="page__title">검색</div>

            <div className="form">
                <div className="form__block">
                    <input 
                        id="search"
                        className="form__input"
                        onChange={ handleQueryChange }
                        placeholder={ user?.uid ? "검색어를 입력하십시오." : "접속이후 이용해주십시오." }
                        disabled={ !user?.uid }
                    />
                </div>
            </div>

            <div className="search">
                <div className="search__tabs">
                    <div className={`search__tab ${'search__tab--active'}`}>게시글</div> 
                </div>

                <div className="search__list">
                { searchPosts?.map((item) => <PostItem key={item?.id} post={ item }/>) }
                </div>
            </div>
        </div>
    )
}