import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "firebaseApp";
// components
import PostItem from "components/post/PostItem";
// 데이터 타입
import { PostType } from "interface";
// hooks
import useTranslation from "hooks/useTranslation";



export default function HomePage() {
    const [ postList, setPostList ] = useState<PostType[]>([])
    const { translation } = useTranslation()

    // 게시물리스트 요청 함수
    const fetchPostList = async () => {
        try {
            const postsRef = collection(db, 'posts')
            const postsQuery = query(postsRef, orderBy('createdAt', 'desc'))

            // 실시간 리스너 부착을 위해 onSnapshot으로 가져오기
            onSnapshot(postsQuery, (snapshot) => {
                const result = snapshot?.docs?.map((item) => ({ ...item.data(), id : item?.id }))
                setPostList(result as PostType[])
            })
        } catch(err : any) {
            console.log(err?.code)
        }
    }

    useEffect(() => {
        fetchPostList()
    }, [])
    

    return (
        <div className="">
            <div className="page-header">{ translation('MENU_HOME') }</div>
            <div>
            { postList?.map((item) => <PostItem key={item?.id} post={ item }/>) }
            </div>
        </div>
    )
}