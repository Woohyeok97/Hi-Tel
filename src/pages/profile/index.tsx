import { useCallback, useContext, useEffect, useState } from "react";
import AuthContext from "context/AuthContext";
import { Link, useParams } from "react-router-dom";
import { collection, doc, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db } from "firebaseApp";
// 컴포넌트
import PostItem from "components/post/PostItem";
import FollowBtn from "components/followBtn/FollowBtn";
// hooks
import useTranslation from "hooks/useTranslation";
// 데이터 타입
import { FollowType, PostType, ProfileType } from "interface";


interface UserInfoType {
    myPosts : PostType[],
    likePosts? : PostType[],
    following : string[]
    follower : string[],
}

type TabType = 'myPosts' | 'likePosts'

export default function ProfilePage() {
    const { id } = useParams()
    const { user } = useContext(AuthContext)
    // 탭 상태관리
    const [ activeTab, setActiveTab ] = useState<TabType>('myPosts')
    const [ profile, setProfile ] = useState<ProfileType | null>(null)
    // 유저정보 상태관리
    const [ userInfo, setUserInfo ] = useState<UserInfoType | null>(null)
    const { translation } = useTranslation()

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
                const followerRef = doc(db, 'follower', profile?.uid)
                const followingRef = doc(db, 'following', profile?.uid)

                onSnapshot(postsQuery, (snapshot) => {
                    // fetchData.postList = snapshot?.docs?.map((item) => ({ ...item?.data(), id : item?.id } as PostType))
                    const result = snapshot?.docs?.map((item) => ({ ...item?.data(), id : item?.id } as PostType))
                    setUserInfo((prev) => ({ ...prev, myPosts : result } as UserInfoType))
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

                // 로그인 상태일때만 추천 게시글 가져오기 
                if(profile?.uid === user?.uid) {
                    const likesQuery = query(postsRef, where('likes', 'array-contains', user?.uid), orderBy('createdAt', 'desc'))

                    onSnapshot(likesQuery, (snapshot) => {
                        // fetchData.likePostList = snapshot?.docs?.map((item) => ({ ...item?.data(), id : item?.id } as PostType))
                        const result = snapshot?.docs?.map((item) => ({ ...item?.data(), id : item?.id } as PostType))
                        setUserInfo((prev) => ({ ...prev, likePosts : result } as UserInfoType))
                    })
                }

            } catch(err : any) {
                console.log(err?.code)
            }
        }
    }, [profile?.uid])


    // 프로필 가져오기
    useEffect(() => {
        if(id) {
            fetchProfile()
            setActiveTab('myPosts')
        }
    }, [fetchProfile, id])

    // 유저정보 가져오기
    useEffect(() => {
        if(profile?.uid)  fetchUserInfo()
    }, [fetchUserInfo, profile?.uid])

    // console.log('렌더링') // 리팩전 -> 전부 3번
    // console.log('렌더링') // 각각 userInfo 업데이트 -> 4번
    // 가끔씩 팔로우/언팔로우 버튼을 누르면 팔로잉/팔로워 둘다 올라가던데 왜그러지..
    // console.log(profile, userInfo)
    console.log(userInfo)
    return (
        <>{ userInfo && 
        <div className="">
            <div className="flex flex-col pb-10 border-gray border-b-2">
                <div className="flex justify-between mb-10">
                    <img src={profile?.photoUrl} className="profile-img"/>

                    <div className="flex justify-between gap-10">
                        <div className={`flex flex-col text-btn justify-center items-center cursor-pointer text-2xl lg:text-3xl`}>
                            <div className={`text-3xl lg:text-4xl`}>
                                { userInfo?.myPosts?.length || 0 }
                            </div>
                            <span>{ translation('POST') }</span>
                        </div>
                        <div className={`flex flex-col text-btn justify-center items-center cursor-pointer text-2xl lg:text-3xl`}>
                            <div className={`text-3xl lg:text-4xl`}>
                                { userInfo?.follower?.length || 0 }
                            </div>
                            <span>{ translation('FOLLOWER') }</span>
                        </div>
                        <div className={`flex flex-col text-btn justify-center items-center cursor-pointer text-2xl lg:text-3xl`}>
                            <div className={`text-3xl lg:text-4xl`}>
                                { userInfo?.following?.length || 0 }
                            </div>
                            <span>{ translation('FOLLOWING') }</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between">
                    <div>
                        <div className="text-3xl font-bold">
                            { profile?.displayName || "이름미지정" }
                        </div>
                        <div className="text-gray">{ profile?.email }</div>
                    </div>
                    
                    { profile?.uid && user?.uid !== profile?.uid ? 
                    <FollowBtn targetUid={ profile?.uid }/> 
                    :                     
                    <Link to="/profile/edit" className="text-btn underline underline-offset-2">
                        { translation('EDIT') }
                    </Link> }
                </div>
            </div>

            <div className="flex gap-5 py-8">
                <div className={`text-gray hover:text-grayHover font-bold cursor-pointer text-2xl
                ${ activeTab === 'myPosts' && 'text-white hover:text-whiteHover' }`}
                    onClick={() => setActiveTab('myPosts')}>
                    { translation('POST') }
                </div>

                {/* like탭은 나의 프로필 페이지에서 렌더링 */}
                { profile?.uid === user?.uid &&
                <div className={`text-gray hover:text-grayHover font-bold cursor-pointer text-2xl
                ${ activeTab === 'likePosts' && 'text-white hover:text-whiteHover' }`}
                    onClick={() => setActiveTab('likePosts')}>
                    { translation('LIKE') }
                </div> }
            </div>

            <div>
            { userInfo[activeTab]?.map((item) => <PostItem key={item?.id} post={ item }/>) }
            {/* { userInfo?.postList?.map((item) => <PostItem key={item?.id} post={ item }/>) } */}
            </div>
        </div> } </>
    )
}