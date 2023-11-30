import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "firebaseApp";
// components
import PostItem from "components/post/PostItem";
// 데이터 타입
import { PostType } from "interface";
import { Link } from "react-router-dom";


export default function HomePage() {
    const [ postList, setPostList ] = useState<PostType[]>([])

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

    // 로그아웃하면 fetchPostList()가 안되는 에러발견..
    // user랑 상관없는데 왜..?
    useEffect(() => {
        fetchPostList()
    }, [])
    

    return (
        <div className="page">
            <div className="page__header">
                <h1>초기화면</h1>
            </div>
            <div>
                <div className="page__flex">
                    <div className="page__title">[ 게 / 시 / 물 / 광 / 장 ]</div>
                    <div className="page__notification">
                        <Link to='/notification'>알림</Link>
                    </div> 
                </div>
                
                <div>
                { postList?.map((item) => <PostItem key={item?.id} post={ item }/>) }
                </div>
            </div>
        </div>
    )
}