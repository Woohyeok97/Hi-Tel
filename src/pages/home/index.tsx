// components
import PostItem from "components/post/PostItem";
// 데이터   타입
import { PostType } from "interface";

const TEMP : PostType[] = [
    { 
        id : '1',
        uid : '11',
        email : 'ㄴㅇㅁㅇㄴ',
        content : '하이요',
        createdAt : '2023년 11월 25일', 
    },
    { 
        id : '2',
        uid : '21',
        email : 'ㄴㅇㅁㅇㄴ',
        content : '하이요',
        createdAt : '2023년 11월 25일', 
    },
    { 
        id : '3',
        uid : '31',
        email : 'ㄴㅇㅁㅇㄴ',
        content : '하이요',
        createdAt : '2023년 11월 25일', 
    },
    { 
        id : '4',
        uid : '131',
        email : 'ㄴㅇㅁㅇㄴ',
        content : '하이요',
        createdAt : '2023년 11월 25일', 
    },
    { 
        id : '5',
        uid : '321',
        email : 'ㄴㅇㅁㅇㄴ',
        content : '하이요',
        createdAt : '2023년 11월 25일', 
    },
]

export default function HomePage() {

    return (
        <div className="page">
            <div className="page__header">
                <h1>초기화면</h1>
            </div>
            <div>
                <div className="page__title">[ 게 / 시 / 물 / 광 / 장 ]</div>
                <div>
                { TEMP?.map((item) => <PostItem key={item?.id} post={ item }/>) }
                </div>
            </div>
        </div>
    )
}