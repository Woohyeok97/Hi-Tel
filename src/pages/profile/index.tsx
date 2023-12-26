import { useContext, useEffect, useState } from "react";
import AuthContext from "context/AuthContext";
import { Link, useParams } from "react-router-dom";
import { collection, doc, getDoc, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "firebaseApp";
// 컴포넌트
import PostItem from "components/post/PostItem";
import FollowBtn from "components/followBtn/FollowBtn";
// hooks
import useTranslation from "hooks/useTranslation";
// 데이터 타입
import { FollowType, PostType, ProfileType } from "interface";
import { useQueries, useQuery } from "react-query";
import TempPost from "pages/Temp";


type TabType = 'myPosts' | 'likePosts'

export default function ProfilePage() {
    const { id } = useParams()
    const { user } = useContext(AuthContext)
    const [ activeTab, setActiveTab ] = useState<TabType>('myPosts')
    const { translation } = useTranslation()

    // 유저 프로필 요청함수
    const fetchProfile = async () => {
        if(id) {
            const profileRef = doc(db, 'profiles', id)
            const result = await getDoc(profileRef)
    
            if(!result.exists()) {
                return null
            }
            return { ...result?.data(), uid : result?.id } as ProfileType
        }
    }

    // 유저 프로필
    const { data : profile, isError, isLoading } = useQuery([`profile-${id}`], fetchProfile, {
        enabled : !!id,
        refetchOnWindowFocus : false,
        staleTime : 10000,
    })

    const fetchPost = async () => {
        const postsRef = collection(db, 'posts')
        const postsQuery = query(postsRef, where('uid', '==', profile?.uid), orderBy('createdAt', 'desc'))
        const result = await getDocs(postsQuery)
        
        return result?.docs?.map((item) => ({ ...item?.data(), id : item?.id })) as PostType[]
    }

    const fetchLikePost = async () => {
        const postsRef = collection(db, 'posts')
        const likesQuery = query(postsRef, where('likes', 'array-contains', user?.uid), orderBy('createdAt', 'desc'))
        const result = await getDocs(likesQuery)
        
        return result?.docs?.map((item) => ({ ...item?.data(), id : item?.id })) as PostType[]
    }

    const fetchFollower = async () => {
        if(profile?.uid) {
            const followerRef = doc(db, 'follower', profile?.uid)
            const result = await getDoc(followerRef)

            return result?.data()?.users?.map((item : FollowType) => item?.uid)
        }
    }

    const fetchFollowing = async () => {
        if(profile?.uid) {
            const followingRef = doc(db, 'following', profile?.uid)
            const result = await getDoc(followingRef)

            return result?.data()?.users?.map((item : FollowType) => item?.uid)
        }
    }

    const queryOptions = {
        enabled : !!profile,
        refetchOnWindowFocus : false,
        staleTime : 10000,
    }
    const [ myPosts, likePosts, follower, following ] = useQueries([
        { queryKey : ['postList', profile?.uid], queryFn : fetchPost, ...queryOptions },
        { queryKey : ['likePosts', profile?.uid], queryFn : fetchLikePost, ...queryOptions, enabled : !!profile && profile?.uid === user?.uid },
        { queryKey : ['follower', profile?.uid], queryFn : fetchFollower, ...queryOptions },
        { queryKey : ['following', profile?.uid], queryFn : fetchFollowing, ...queryOptions },
    ])

    useEffect(() => {
        setActiveTab('myPosts')
    }, [id])


    const loadingState = [ myPosts, likePosts, follower, following ]?.some(query => query.isLoading);
    const errorState = [ myPosts, likePosts, follower, following ]?.every(query => !query.isLoading && !query.isError);

    if(isError) return <div>에러발생</div>

    if(isLoading) return <div>로딩중..</div>

    if(!profile) return <div>유저정보가 없습니다.</div>

    if(loadingState) return <div>로딩중..!</div>

    if(!errorState) return <div>유저정보 에러발생</div>

    
    return (
        <div className="">
            <div className="flex flex-col pb-10 border-gray border-b-2">
                <div className="flex justify-between mb-10">
                    <img src={profile?.photoUrl} className="profile-img"/>

                    <div className="flex justify-between gap-10">
                        <div className={`flex flex-col text-btn justify-center items-center cursor-pointer text-2xl lg:text-3xl`}>
                            <div className={`text-3xl lg:text-4xl`}>
                                { myPosts?.data?.length || 0 }
                            </div>
                            <span>{ translation('POST') }</span>
                        </div>
                        <div className={`flex flex-col text-btn justify-center items-center cursor-pointer text-2xl lg:text-3xl`}>
                            <div className={`text-3xl lg:text-4xl`}>
                                { follower?.data?.length || 0 }
                            </div>
                            <span>{ translation('FOLLOWER') }</span>
                        </div>
                        <div className={`flex flex-col text-btn justify-center items-center cursor-pointer text-2xl lg:text-3xl`}>
                            <div className={`text-3xl lg:text-4xl`}>
                                { following?.data?.length || 0 }
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
                        <div>uid : { user?.uid }</div>
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
            <TempPost/>
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
            { activeTab === 'myPosts' && myPosts?.data?.map((item) => <PostItem key={item?.id} post={ item }/> )}

            { activeTab === 'likePosts' && profile?.uid === user?.uid &&
                likePosts?.data?.map((item) => <PostItem key={item?.id} post={ item }/> )
            }
            </div>
        </div>
    )
}