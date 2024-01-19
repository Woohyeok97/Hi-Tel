import { useContext, useState } from "react"
import AuthContext from "context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { useRecoilState } from "recoil";
import { searchQueryState } from "atom";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "firebaseApp";
// components
import PostItem from "components/post/PostItem";
// hooks
import useTranslation from "hooks/useTranslation";
// 데이터 타입
import { PostType } from "interface";



export default function SearchPage() {
    const { user } = useContext(AuthContext)
    // const [ searchQuery, setSearchQuery ] = useRecoilState(searchQueryState)
    const [ searchQuery, setSearchQuery ] = useState('')
    const { translation } = useTranslation()

    // 게시글 요청 함수
    const fetchPostList = async () => {
        const postsRef = collection(db, 'posts')
        const postsQuery = query(postsRef, where('hashTag', 'array-contains', searchQuery), orderBy('createdAt', "desc"))
        const result = await getDocs(postsQuery)
      
        return result?.docs?.map((item) => ({ ...item?.data(), id : item?.id })) as PostType[]
    }

    const { data : searchPosts, isError, isLoading, isFetching } = useQuery({
        queryKey : [`postList`, searchQuery],
        queryFn : fetchPostList,
        enabled : !!searchQuery,
        refetchOnWindowFocus : false,
        // staleTime : 30000,
    })
    
    // 검색쿼리 핸들러
    const handleQueryChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e?.target;
        setSearchQuery(value?.trim())
    }


    return (
        <div className="page-container">
            <div className="page-header">{ translation('MENU_SEARCH') }</div>

            <div className="mb-5">
                <input 
                    id="search"
                    className="text-input w-full"
                    onChange={ handleQueryChange }
                    value={ searchQuery }
                    placeholder={ user?.uid ? "검색어를 입력하십시오." : "접속이후 이용해주십시오." }
                    disabled={ !user?.uid }
                />
            </div>

            <div className="">
                <div className="py-3 md:py-6">
                    <div className={`text-btn font-bold lg-text`}>
                        { translation('POST') }
                    </div> 
                </div>
                <div className="">
                { isFetching && searchQuery ? 
                    <div className="w-full text-4xl text-center p-6 mt-3">
                        Loading...
                    </div> : 
                    searchPosts?.map((item) => <PostItem key={item?.id} post={ item }/>) }
                </div> 

                { isError && 
                <div>
                    <div className="w-full text-5xl text-center p-6 mt-3">
                        Error
                    </div>
                    <p className="text-center">다시 한번 시도해 주십시오.</p>
                </div> }
            </div>
        </div>
    )
}