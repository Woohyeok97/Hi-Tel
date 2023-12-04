import { useCallback, useContext, useEffect, useState } from "react";
import AuthContext from "context/AuthContext";
import { Link, useParams } from "react-router-dom";
import { collection, doc, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "firebaseApp";
// 컴포넌트
import PostItem from "components/post/PostItem";
import FollowBtn from "components/followBtn/FollowBtn";
// 데이터 타입
import { FollowType, PostType, ProfileType } from "interface";

interface UserInfoType {
    postList : PostType[],
    likePostList? : PostType[],
    following : string[]
    follower : string[],
}

export default function ProfilePage() {
    const { id } = useParams()
    const { user } = useContext(AuthContext)
    const [ profile, setProfile ] = useState<ProfileType | null>(null)
    // 유저정보 상태관리
    const [ userInfo, setUserInfo ] = useState<UserInfoType | null>(null)

    // 프로필 요청 함수
    const fetchProfile = useCallback(() => {
        if(id) {
            try {
                const profileRef = doc(db, 'profiles', id)
                onSnapshot(profileRef, (doc) => {
                    setProfile({ ...doc?.data(), uid : doc?.id} as ProfileType)
                })
            } catch(err : any) {
                console.log(err?.code)
            }
        }
    }, [id])

    // 유저정보 요청 함수(한번에 상태 업데이트)
    const fetchUserInfo = useCallback(() => {
        if(profile?.uid) {

            try {
                // 각각의 정보를 onSnapshot으로 가져온뒤, fetchData에 저장
                const postsRef = collection(db, 'posts')
                const postsQuery = query(postsRef, where('uid', '==', profile?.uid), orderBy('createdAt', 'desc'))
                const likesQuery = query(postsRef, where('likes', 'array-contains', user?.uid), orderBy('createdAt', 'desc'))
                const followerRef = doc(db, 'follower', profile?.uid)
                const followingRef = doc(db, 'following', profile?.uid)

                onSnapshot(postsQuery, (snapshot) => {
                    // fetchData.postList = snapshot?.docs?.map((item) => ({ ...item?.data(), id : item?.id } as PostType))
                    const result = snapshot?.docs?.map((item) => ({ ...item?.data(), id : item?.id } as PostType))
                    setUserInfo((prev) => ({ ...prev, postList : result } as UserInfoType))
                })
                onSnapshot(likesQuery, (snapshot) => {
                    // fetchData.likePostList = snapshot?.docs?.map((item) => ({ ...item?.data(), id : item?.id } as PostType))
                    const result = snapshot?.docs?.map((item) => ({ ...item?.data(), id : item?.id } as PostType))
                    setUserInfo((prev) => ({ ...prev, likePostList : result } as UserInfoType))
                })
                onSnapshot(followerRef, (doc) => {
                    // fetchData.follower = doc?.data()?.users?.map((item : FollowType) => (item?.uid))
                    const result = doc?.data()?.users?.map((item : FollowType) => (item?.uid))
                    setUserInfo((prev) => ({ ...prev, follower : result } as UserInfoType))
                })
                onSnapshot(followingRef, (doc) => {
                    // fetchData.following = doc?.data()?.users?.map((item : FollowType) => (item?.uid))
                    const result = doc?.data()?.users?.map((item : FollowType) => (item?.uid))
                    setUserInfo((prev) => ({ ...prev, following : result } as UserInfoType))
                })

            } catch(err : any) {
                console.log(err?.code)
            }
        }
    }, [profile?.uid])


    // 프로필 가져오기
    useEffect(() => {
        if(id) fetchProfile()
    }, [fetchProfile, id])

    // 유저정보 가져오기
    useEffect(() => {
        if(profile?.uid)  fetchUserInfo()
    }, [fetchUserInfo, profile?.uid])

    // console.log('렌더링') // 리팩전 -> 전부 3번
    // console.log('렌더링') // 각각 userInfo 업데이트 -> 4번
    // 가끔씩 팔로우/언팔로우 버튼을 누르면 팔로잉/팔로워 둘다 올라가던데 왜그러지..
    // console.log(profile, userInfo)
    
    return (
        <>{ userInfo && 
        <div className="page">
            <div className="page__header">
                <h1>회원정보</h1>
            </div>

            <div className="profile">
                <div className="profile__header">
                    <img src={profile?.photoUrl} className="profile__user-img"/>
                    <div className="profile__flex-between">
                        <div className={`profile__info`}>
                            <div>{ userInfo?.postList?.length || 0 }</div>게시물
                        </div>
                        <div className={`profile__info ${false && 'profile__info-no'}`}>
                            <div>{ userInfo?.follower?.length || 0 }</div>팔로워
                        </div>
                        <div className={`profile__info ${false && 'profile__info-no'}`}>
                            <div>{ userInfo?.following?.length || 0 }</div>팔로윙
                        </div>
                    </div>
                </div>

                <div className="profile__user">
                    <div className="profile__flex-between">
                        <div>
                            <div className="profile__name">{ profile?.displayName || "이름미지정" }</div>
                            <div className="profile__email">{ profile?.email }</div>
                        </div>
                        
                        { profile?.uid && user?.uid !== profile?.uid ? 
                        <FollowBtn targetUid={ profile?.uid }/> 
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
            { userInfo?.postList?.map((item) => <PostItem key={item?.id} post={ item }/>) }
            </div>
        </div> } </>
    )
}