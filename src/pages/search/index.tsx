import { useContext, useEffect, useState } from "react"
import AuthContext from "context/AuthContext";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "firebaseApp";
// components
import PostItem from "components/post/PostItem";
// hooks
import useTranslation from "hooks/useTranslation";
// 데이터 타입
import { PostType } from "interface";


export default function SearchPage() {
    const { user } = useContext(AuthContext)
    const [ searchQuery, setSearchQuery ] = useState<string>('')
    const [ searchPosts, setSearchPost ] = useState<PostType[]>([])
    const { translation } = useTranslation()

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
        <div className="">
            <div className="page-header">{ translation('MENU_SEARCH') }</div>

            <div className="mb-5">
                <input 
                    id="search"
                    className="text-input w-full"
                    onChange={ handleQueryChange }
                    placeholder={ user?.uid ? "검색어를 입력하십시오." : "접속이후 이용해주십시오." }
                    disabled={ !user?.uid }
                />
            </div>

            <div className="border-gray border-t-2">
                <div className="py-6">
                    <div className={`text-btn font-bold text-2xl`}>
                        { translation('POST') }
                    </div> 
                </div>

                <div className="">
                { searchPosts?.map((item) => <PostItem key={item?.id} post={ item }/>) }
                </div>
            </div>
        </div>
    )
}