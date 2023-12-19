import { useContext, useEffect, useState } from "react"
import AuthContext from "context/AuthContext";
import { useQuery } from "react-query";
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
    const [ searchQuery, setSearchQuery ] = useRecoilState(searchQueryState)
    const [ textValue, setTextValue ] = useState<string>(searchQuery)
    const { translation } = useTranslation()

    // 게시글 요청 함수
    const fetchPostList = async () => {
        const postsRef = collection(db, 'posts')
        const postsQuery = query(postsRef, where('hashTag', 'array-contains', searchQuery), orderBy('createdAt', "desc"))
        const result = await getDocs(postsQuery)
  
        return result?.docs?.map((item) => ({ ...item?.data(), id : item?.id })) as PostType[]
    }

    const { data : searchPosts, isLoading } = useQuery([`post-search`, searchQuery], fetchPostList, {
        enabled : !!searchQuery,
        refetchOnWindowFocus : false,
        staleTime : 30000,
    })
    

    // 검색쿼리 핸들러
    const handleQueryChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e?.target;
        setTextValue(value?.trim())
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchQuery(textValue)
        }, 500)

        return () => clearTimeout(timer)

    }, [textValue])


    return (
        <div className="">
            <div className="page-header">{ translation('MENU_SEARCH') }</div>

            <div className="mb-5">
                <input 
                    id="search"
                    className="text-input w-full"
                    onChange={ handleQueryChange }
                    value={ textValue }
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

                { isLoading ? <div>Loading..</div> :
                <div className="">
                    { searchPosts?.map((item) => <PostItem key={item?.id} post={ item }/>) }
                </div> }
            </div>
        </div>
    )
}