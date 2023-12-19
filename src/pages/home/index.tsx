import { useQuery } from "react-query";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "firebaseApp";
// components
import PostItem from "components/post/PostItem";
// 데이터 타입
import { PostType } from "interface";
// hooks
import useTranslation from "hooks/useTranslation";


export default function HomePage() {
    const { translation } = useTranslation()

    // 게시물리스트 요청 함수
    const fetchPostList = async () => {
        const postsRef = collection(db, 'posts')
        const postsQuery = query(postsRef, orderBy('createdAt', 'desc'))
        const result = await getDocs(postsQuery)

        return result?.docs?.map((item) => ({ ...item?.data(), id : item?.id })) as PostType[]
    }

    const { data : postList, isError, error, isLoading } = useQuery([`post`], fetchPostList, {
        refetchOnWindowFocus : false,
        staleTime : 30000,
    })

    if(isError) return <div>에러발생</div>

    if(isLoading) return <div>하이텔</div>
    

    return (
        <div className="">
            <div className="page-header">{ translation('MENU_HOME') }</div>
            <div>
            { postList?.map((item) => <PostItem key={item?.id} post={ item }/>) }
            </div>
        </div>
    )
}