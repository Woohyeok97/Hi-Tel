import { useCallback, useContext, useEffect, useState } from "react";
import AuthContext from "context/AuthContext";
import { Link, useParams } from "react-router-dom";
// 컴포넌트
import PostItem from "components/post/PostItem";
import FollowBtn from "components/followBtn/FollowBtn";
// 데이터 타입
import { PostType, ProfileType } from "interface";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { db } from "firebaseApp";


const TEMP : PostType[] = [
    { 
        id : '1',
        uid : '11',
        email : 'guk@naver.com',
        content : '자, 그러니 혹시라도 갑자기 이집트가 땡긴다 싶으신 분들은 함께 하시죠! 2024년의 시작을 이집트에서 맞이하시는 건 꽤 즐거운 경험이 될 겁니다.',
        createdAt : '2023년 11월 25일', 
    },
    { 
        id : '2',
        uid : '21',
        email : 'asdw@naver.com',
        content : '아무쪼록 많은 분들이 함께 하셔서 2024년 가장 앞자락을 저와 함께 이집트에서 시작하실 수 있었으면 좋겠습니다. 궁금한 점 있으시면 제게 DM 주세요. 이집트에서 만나요! 흐흐-',
        createdAt : '2023년 11월 25일', 
    },
    { 
        id : '3',
        uid : '31',
        email : 'ddwdw@gamil.com',
        content : '경향신문과 함께 하는 <이집트 문명 탐사>의 1차 일정 (2024년 1월 2일(화) - 1월 14일(일) 10박 13일)에 자리가 조금 생긴 것 같습니다',
        createdAt : '2023년 11월 25일', 
    },
    { 
        id : '4',
        uid : '131',
        email : 'asd3d3@naver.com',
        content : '팔레스타인은 가깝지만 엄연히 이집트와는 다른 나라이고, 제가 지난 3주 동안 이집트에 머물면서 살펴본 바에 따르면, 이집트에는 아무런 문제가 없습니다.',
        createdAt : '2023년 11월 25일', 
    },
]

export default function ProfilePage() {
    const { id } = useParams()
    const { user } = useContext(AuthContext)

    const [ profile, setProfile ] = useState<ProfileType | null>(null)
    const [ postList, setPostList ] = useState<PostType[]>([])

    // 프로필 요청 함수
    const fetchProfile = useCallback(async () => {
        if(id) {
            try {
                const profileRef = collection(db, 'profiles')
                const profileQuery = query(profileRef, where('uid', '==', id))
                onSnapshot(profileQuery, (snapshot) => {
                     
                })
            } catch(err : any) {
                console.log(err?.code)
            }
        }
    }, [id])

    // 프로필 가져오기
    useEffect(() => {
        if(id) fetchProfile()
    }, [fetchProfile, id])

    console.log(profile)

    return (
        <div className="page">
            <div className="page__header">
                <h1>회원정보</h1>
            </div>

            <div className="profile">
                <div className="profile__header">
                    <div className="profile__user-img"></div>
                    <div className="profile__flex-between">
                        <div className={`profile__info`}>
                            <div>0</div>게시물
                        </div>
                        <div className={`profile__info ${false && 'profile__info-no'}`}>
                            <div>0</div>팔로워
                        </div>
                        <div className={`profile__info ${false && 'profile__info-no'}`}>
                            <div>0</div>팔로윙
                        </div>
                    </div>
                </div>

                <div className="profile__user">
                    <div className="profile__flex-between">
                        <div>
                            <div className="profile__name">이름미정</div>
                            <div className="profile__email">qordngur@naver.com</div>
                        </div>
                        
                        { id && user?.uid !== id ? 
                        <FollowBtn targetUid={ id }/> 
                        : 
                        <div className="profile__edit">
                            <Link to="/profile/edit">회원정보 편집</Link> 
                        </div> }
                    </div>
                </div>
            </div>

            <div className="profile__tabs">
                <div className="profile__flex">
                    <div className={`profile__tab ${'profile__tab--active'}`}>작성글</div>
                    <div className={`profile__tab`}>추천글</div> 
                </div>
            </div>

            <div>
            { TEMP?.map((item) => <PostItem key={item?.id} post={ item }/>) }
            </div>
        </div>
    )
}