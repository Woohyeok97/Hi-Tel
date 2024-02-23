import { useContext, useEffect, useState } from "react";
import AuthContext from "context/AuthContext";
import { Link } from "react-router-dom";
import { useQuery, useQueries } from "@tanstack/react-query";
import { collection, doc, getDoc, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "firebaseApp";
// 컴포넌트
import PostItem from "components/post/PostItem";
import FollowBtn from "components/followBtn/FollowBtn";
// hooks
import useTranslation from "hooks/useTranslation";
// 데이터 타입
import { FollowType, PostType, ProfileType } from "interface";
import { fetchFollowerByUid, fetchFollowingByUid, fetchLikePostsByUid, fetchPostsByUid } from "remotes/postAPI";



type TabType = 'myPosts' | 'likePosts';

interface ProfileProps {
  profile: ProfileType;
}
export default function Profile({ profile }: ProfileProps) {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState<TabType>('myPosts');
  const { translation } = useTranslation();

  const queryOptions = {
    refetchOnWindowFocus: false,
    staleTime: 10000,
    suspense: true, 
  };

  const [myPosts, likePosts, follower, following] = useQueries({
    queries: [
      { 
        queryKey: ['postList', profile?.uid],
        queryFn: () => fetchPostsByUid(profile.uid),
        ...queryOptions,
      },
      {
        queryKey: ['likePosts', profile?.uid],
        queryFn: () => fetchLikePostsByUid(profile.uid),
        enabled: profile?.uid === user?.uid,
        ...queryOptions,
      },
      {
        queryKey: ['follower', profile?.uid],
        queryFn: () => fetchFollowerByUid(profile.uid),
        ...queryOptions,
      },
      {
        queryKey: [ 'following', profile?.uid ],
        queryFn: () => fetchFollowingByUid(profile.uid),
        ...queryOptions,
      },
    ]
  });


    // const myPosts = useQuery({
    //     queryKey : ['postList'],
    //     queryFn : fetchPost,
    //     ...queryOptions,
    // })
    
    // const likePosts = useQuery({
    //     queryKey : ['likePosts'],
    //     queryFn : fetchLikePost,
    //     enabled : !!profile && profile?.uid === user?.uid,
    //     ...queryOptions,
    // })
    // const follower = useQuery({
    //     queryKey : ['follower'],
    //     queryFn : fetchFollower,
    //     ...queryOptions,
    // })
    // const following = useQuery({
    //     queryKey : ['following'],
    //     queryFn : fetchFollowing,
    //     ...queryOptions,
    // })

    useEffect(() => {
      setActiveTab('myPosts')
    }, []);

    return (
        <div className="page-container">
            <div className="flex flex-col pb-3 md:pb-6 border-gray border-b-2">
                <div className="flex justify-between pb-5 md:pb-10">
                    <img className="profile-img"/>

                    <div className="flex justify-between gap-5 lg:gap-10">
                        <div className={`flex flex-col text-btn justify-center items-center cursor-pointer lg-text`}>
                            <div className="lg-text">
                                { myPosts?.data?.length || 0 }
                            </div>
                            <span>{ translation('POST') }</span>
                        </div>
                        <div className={`flex flex-col text-btn justify-center items-center cursor-pointer lg-text`}>
                            <div className="lg-text">
                                { follower?.data?.length || 0 }
                            </div>
                            <span>{ translation('FOLLOWER') }</span>
                        </div>
                        <div className={`flex flex-col text-btn justify-center items-center cursor-pointer lg-text`}>
                            <div className="lg-text">
                                { following?.data?.length || 0 }
                            </div>
                            <span>{ translation('FOLLOWING') }</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between">
                    <div>
                        <div className="lg-text font-bold">
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

            <div className="flex gap-5 py-4 md:py-8">
                <div className={`text-gray hover:text-grayHover font-bold cursor-pointer lg-text
                ${ activeTab === 'myPosts' && 'text-white hover:text-whiteHover' }`}
                    onClick={() => setActiveTab('myPosts')}>
                    { translation('POST') }
                </div>

                {/* like탭은 나의 프로필 페이지에서 렌더링 */}
                { profile?.uid === user?.uid &&
                <div className={`text-gray hover:text-grayHover font-bold cursor-pointer lg-text
                ${ activeTab === 'likePosts' && 'text-white hover:text-whiteHover' }`}
                    onClick={() => setActiveTab('likePosts')}>
                    { translation('LIKE') }
                </div> }
            </div>

            <div>
            { activeTab === 'myPosts' && myPosts?.data?.map((item) => <PostItem key={item?.id} post={ item }/> )}
            {/* { activeTab === 'myPosts' && myPosts?.data?.map((item) => <div key={item?.id}>{ item?.content }</div> )} */}

            { activeTab === 'likePosts' && profile?.uid === user?.uid &&
                likePosts?.data?.map((item) => <PostItem key={item?.id} post={ item }/> )
            }
            </div>
        </div>
    )
    // return (
    //     <div className="page-container">
    //         <div className="flex flex-col pb-10 border-gray border-b-2">
    //             <div className="flex justify-between mb-10">
    //                 <img src={profile?.photoUrl} className="profile-img"/>

    //                 <div className="flex justify-between gap-10">
    //                     <div className={`flex flex-col text-btn justify-center items-center cursor-pointer text-2xl lg:text-3xl`}>
    //                         <div className={`text-3xl lg:text-4xl`}>
    //                             { myPosts?.data?.length || 0 }
    //                         </div>
    //                         <span>{ translation('POST') }</span>
    //                     </div>
    //                     <div className={`flex flex-col text-btn justify-center items-center cursor-pointer text-2xl lg:text-3xl`}>
    //                         <div className={`text-3xl lg:text-4xl`}>
    //                             { follower?.data?.length || 0 }
    //                         </div>
    //                         <span>{ translation('FOLLOWER') }</span>
    //                     </div>
    //                     <div className={`flex flex-col text-btn justify-center items-center cursor-pointer text-2xl lg:text-3xl`}>
    //                         <div className={`text-3xl lg:text-4xl`}>
    //                             { following?.data?.length || 0 }
    //                         </div>
    //                         <span>{ translation('FOLLOWING') }</span>
    //                     </div>
    //                 </div>
    //             </div>

    //             <div className="flex justify-between">
    //                 <div>
    //                     <div className="text-3xl font-bold">
    //                         { profile?.displayName || "이름미지정" }
    //                     </div>
    //                     <div className="text-gray">{ profile?.email }</div>
    //                 </div>
                    
    //                 { profile?.uid && user?.uid !== profile?.uid ? 
    //                 <FollowBtn targetUid={ profile?.uid }/> 
    //                 :                     
    //                 <Link to="/profile/edit" className="text-btn underline underline-offset-2">
    //                     { translation('EDIT') }
    //                 </Link> }
    //             </div>
    //         </div>

    //         <div className="flex gap-5 py-8">
    //             <div className={`text-gray hover:text-grayHover font-bold cursor-pointer text-2xl
    //             ${ activeTab === 'myPosts' && 'text-white hover:text-whiteHover' }`}
    //                 onClick={() => setActiveTab('myPosts')}>
    //                 { translation('POST') }
    //             </div>

    //             {/* like탭은 나의 프로필 페이지에서 렌더링 */}
    //             { profile?.uid === user?.uid &&
    //             <div className={`text-gray hover:text-grayHover font-bold cursor-pointer text-2xl
    //             ${ activeTab === 'likePosts' && 'text-white hover:text-whiteHover' }`}
    //                 onClick={() => setActiveTab('likePosts')}>
    //                 { translation('LIKE') }
    //             </div> }
    //         </div>

    //         <div>
    //         { activeTab === 'myPosts' && myPosts?.data?.map((item) => <PostItem key={item?.id} post={ item }/> )}
    //         {/* { activeTab === 'myPosts' && myPosts?.data?.map((item) => <div key={item?.id}>{ item?.content }</div> )} */}

    //         { activeTab === 'likePosts' && profile?.uid === user?.uid &&
    //             likePosts?.data?.map((item) => <PostItem key={item?.id} post={ item }/> )
    //         }
    //         </div>
    //     </div>
    // )
}
