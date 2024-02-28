// import { Suspense, useContext, useEffect, useState } from "react";
// import AuthContext from "context/AuthContext";
// import { Link } from "react-router-dom";
// import { useQueries, useQuery } from "@tanstack/react-query";
// // 컴포넌트
// import PostItem from "components/post/PostItem";
// import FollowBtn from "components/followBtn/FollowBtn";
// // hooks
// import useTranslation from "hooks/useTranslation";
// // type
// import { ProfileType } from "interface";

// import UserInfo from "./UserInfo";
// import Loader from "components/UI/Loader";
// import PostList from "./PostList";
// import { fetchPostsByUid } from "remotes/postAPI";


// type TabType = 'myPosts' | 'likePosts';

// interface ProfileProps {
//   profile: ProfileType;
// }
// export default function Profile({ profile }: ProfileProps) {
//   const { user } = useContext(AuthContext);
//   const [activeTab, setActiveTab] = useState<TabType>('myPosts');
//   const { translation } = useTranslation();

//   useEffect(() => {
//     setActiveTab('myPosts')
//   }, []);

//   // const queryOptions = {
//   //   refetchOnWindowFocus: false,
//   //   staleTime: 10000,
//   // };

//   // const [myPosts, likePosts, follower, following] = useQueries({
//   //   queries: [
//   //     { 
//   //       queryKey: ['postList', profile?.uid],
//   //       queryFn: () => fetchPostsByUid(profile.uid),
//   //       ...queryOptions,
//   //     },
//   //     {
//   //       queryKey: ['likePosts', profile?.uid],
//   //       queryFn: () => fetchLikePostsByUid(profile.uid),
//   //       enabled: profile?.uid === user?.uid,
//   //       ...queryOptions,
//   //     },
//   //     {
//   //       queryKey: ['follower', profile?.uid],
//   //       queryFn: () => fetchFollowerByUid(profile.uid),
//   //       ...queryOptions,
//   //     },
//   //     {
//   //       queryKey: [ 'following', profile?.uid ],
//   //       queryFn: () => fetchFollowingByUid(profile.uid),
//   //       ...queryOptions,
//   //     },
//   //   ]
//   // });

//   return (
//     <div className="page-container">
//       <div className="flex flex-col pb-3 md:pb-6 border-gray border-b-2">
        
//         <Suspense fallback={<h1>Loading!!!!</h1>}>
//           <UserInfo uid={profile.uid} />
//         </Suspense>
//         <div className="flex justify-between">
//           <div>
//             <div className="lg-text font-bold">
//               { profile?.displayName || "이름미지정" }
//             </div>
//             <div className="text-gray">{ profile?.email }</div>
//           </div>
          
//           { profile?.uid && user?.uid !== profile?.uid ? 
//           <FollowBtn targetUid={ profile?.uid }/> 
//           :                     
//           <Link to="/profile/edit" className="text-btn underline underline-offset-2">
//             { translation('EDIT') }
//           </Link> }
//         </div>
//       </div>

//       <div className="flex gap-5 py-4 md:py-8">
//         <div className={`text-gray hover:text-grayHover font-bold cursor-pointer lg-text
//         ${ activeTab === 'myPosts' && 'text-white hover:text-whiteHover' }`}
//             onClick={() => setActiveTab('myPosts')}>
//             { translation('POST') }
//         </div>

//         {/* like탭은 나의 프로필 페이지에서 렌더링 */}
//         { profile?.uid === user?.uid &&
//         <div className={`text-gray hover:text-grayHover font-bold cursor-pointer lg-text
//         ${ activeTab === 'likePosts' && 'text-white hover:text-whiteHover' }`}
//             onClick={() => setActiveTab('likePosts')}>
//             { translation('LIKE') }
//         </div> }
//       </div>

//       <Suspense fallback={<h1>Loading!!</h1>}>
//           { activeTab === 'myPosts' && <PostList uid={profile.uid} fetch={fetchPostsByUid} /> }
//       </Suspense>

//       {/* <div>
//       { activeTab === 'myPosts' && myPosts?.data?.map((item) => <PostItem key={item?.id} post={ item }/> )}

//       { activeTab === 'likePosts' && profile?.uid === user?.uid &&
//         likePosts?.data?.map((item) => <PostItem key={item?.id} post={ item }/> )
//       }
//       </div> */}
//     </div>
//   );
// }

import { Suspense, useContext, useEffect, useState } from "react";
import AuthContext from "context/AuthContext";
import { Link } from "react-router-dom";
// 컴포넌트
import QueryFetcher from "./QueryFetcher";
import PostItem from "components/post/PostItem";
import FollowBtn from "components/followBtn/FollowBtn";
// hooks
import useTranslation from "hooks/useTranslation";
// 데이터 타입
import { PostType, ProfileType } from "interface";
// remotes
import { fetchFollowerByUid, fetchFollowingByUid, fetchLikePostsByUid, fetchPostsByUid } from "remotes/postAPI";


type TabType = 'myPosts' | 'likePosts';

interface ProfileProps {
  profile: ProfileType;
}
export default function Profile({ profile }: ProfileProps) {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState<TabType>('myPosts');
  const { translation } = useTranslation();

  useEffect(() => {
    setActiveTab('myPosts')
  }, []);

  const queryOptions = {
    refetchOnWindowFocus: false,
    staleTime: 10000,
  };
  
  return (
    <div className="page-container">
      <div className="flex flex-col pb-3 md:pb-6 border-gray border-b-2">
        <div className="flex justify-between pb-5 md:pb-10">
          <img className="profile-img"/>

          <div className="flex justify-between gap-5 lg:gap-10">
            <div className={`flex flex-col text-btn justify-center items-center cursor-pointer lg-text`}>
              <div className="lg-text">
                <Suspense fallback={<h1>로딩!!!</h1>}>
                  <QueryFetcher
                    queryKey={['postList', profile?.uid]}
                    queryFn={() => fetchPostsByUid(profile.uid)}
                    queryOpt={queryOptions}
                    renderFn={(data) => data?.length || 0}
                  />
                </Suspense>
              </div>
              <span>{ translation('POST') }</span>
            </div>
            <div className={`flex flex-col text-btn justify-center items-center cursor-pointer lg-text`}>
              <div className="lg-text">
                <Suspense fallback={<h1>로딩!!!</h1>}>
                  <QueryFetcher
                    queryKey={['follower', profile?.uid]}
                    queryFn={() => fetchFollowerByUid(profile.uid)}
                    queryOpt={queryOptions}
                    renderFn={(data) => data?.length || 0}
                  />
                </Suspense>
              </div>
              <span>{ translation('FOLLOWER') }</span>
            </div>
            <div className={`flex flex-col text-btn justify-center items-center cursor-pointer lg-text`}>
              <div className="lg-text">
                <Suspense fallback={<h1>로딩!!!</h1>}>
                  <QueryFetcher
                    queryKey={['following', profile?.uid]}
                    queryFn={() => fetchFollowingByUid(profile.uid)}
                    queryOpt={queryOptions}
                    renderFn={(data) => data?.length || 0}
                  />
                </Suspense>
              </div>
              <span>{ translation('FOLLOWING') }</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <div>
            <div className="lg-text font-bold">
              {profile?.displayName || "이름미지정"}
            </div>
            <div className="text-gray">{ profile?.email }</div>
          </div>
          
          {profile?.uid !== user?.uid ? (
            <FollowBtn targetUid={profile?.uid} /> 
          ) : (
            <Link to="/profile/edit" className="text-btn underline underline-offset-2">
            { translation('EDIT') }
          </Link>)}
        </div>
      </div>

      <div className="flex gap-5 py-4 md:py-8">
        <div className={`text-gray hover:text-grayHover font-bold cursor-pointer lg-text
        ${ activeTab === 'myPosts' && 'text-white hover:text-whiteHover' }`}
          onClick={() => setActiveTab('myPosts')}>
          { translation('POST') }
        </div>

        {/* like탭은 나의 프로필 페이지에서 렌더링 */}
        {profile?.uid === user?.uid && (
        <div className={`text-gray hover:text-grayHover font-bold cursor-pointer lg-text
          ${activeTab === 'likePosts' && 'text-white hover:text-whiteHover' }`}
          onClick={() => setActiveTab('likePosts')}>
          { translation('LIKE') }
        </div>)}
      </div>

      <div>
        {activeTab === 'myPosts' && (
        <Suspense fallback={<h1>로딩중이라고!!</h1>}>
          <QueryFetcher
            queryKey={['postList', profile?.uid]}
            queryFn={() => fetchPostsByUid(profile.uid)}
            queryOpt={queryOptions}
            renderFn={(data) => (
              <div>
                {data?.map((post: PostType) => <PostItem key={post?.id} post={post} />)}
              </div>
            )}
          />
        </Suspense>)}

      {activeTab === 'likePosts' && profile?.uid === user?.uid && (
        <Suspense fallback={<h1>로딩중이라고!!</h1>}>
          <QueryFetcher
            queryKey={['likePosts', profile?.uid]}
            queryFn={() => fetchLikePostsByUid(profile.uid)}
            queryOpt={queryOptions}
            renderFn={(data) => (
              <div>
                {data?.map((post: PostType) => <PostItem key={post?.id} post={post} />)}
              </div>
            )}
          />
        </Suspense>
      )}
      </div>
    </div>
  );
}