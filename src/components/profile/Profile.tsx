import { Suspense, useContext, useEffect, useState } from "react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import AuthContext from "context/AuthContext";
import { Link } from "react-router-dom";
// 컴포넌트
import QueryFetcher from "../shared/QueryFetcher";
import PostItem from "components/post/PostItem";
import FollowBtn from "components/shared/FollowBtn";
import { Spacing } from "components/shared/Spacing";
import { Divider } from "components/shared/Divider";
import { Flex } from "components/shared/Flex";
import { TextButton } from "components/shared/TextButton";
import { Text } from "components/shared/Text";
import { UserImage } from "components/shared/UserImage";
// hooks
import useTranslation from "hooks/useTranslation";
// 데이터 타입
import { PostType } from "interface";
// remotes
import { fetchProfileById } from "remotes/profileAPI";
import { fetchLikePostsByUid, fetchPostsByUid } from "remotes/postAPI";
import { fetchFollowerByUid, fetchFollowingByUid } from "remotes/followAPI";


type TabType = 'myPosts' | 'likePosts';

interface ProfileProps {
  id: string;
}
export default function Profile({ id }: ProfileProps) {
  const { user } = useContext(AuthContext);
  const { translation } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('myPosts');

  useEffect(() => {
    setActiveTab('myPosts');
  }, []);

  const { data: profile } = useSuspenseQuery({
    queryKey: ['profile', id],
    queryFn: () => fetchProfileById(id),
    staleTime: Infinity,
  });

  // 쿼리옵션 생성
  const groupOptions = (key: string) => {
    return queryOptions({
      queryKey: [key, profile.uid],
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    });
  };
  
  return (
    <Flex direction="column">
      <Flex direction="column">
        <Flex justify="space-between">
          <UserImage size={80} />
          <Flex justify="space-between" align="center" gap={20}>
            <TextButton fontSize="md">
              <Flex direction="column" justify="center" align="center">
                <Suspense fallback={<h1>로딩!!!</h1>}>
                  <QueryFetcher
                    queryFn={() => fetchPostsByUid(profile.uid)}
                    queryOpt={groupOptions('postList')}
                    renderFn={(data) => data?.length}
                  />
                </Suspense>
                <Text>{translation('POST')}</Text>
              </Flex>
            </TextButton>
            <TextButton fontSize="md">
              <Flex direction="column" justify="center" align="center">
                <Suspense fallback={<h1>로딩!!!</h1>}>
                  <QueryFetcher
                      queryFn={() => fetchFollowerByUid(profile.uid)}
                      queryOpt={groupOptions('follower')}
                      renderFn={(data) => data?.length || 0}
                    />
                </Suspense>
                <Text>{translation('FOLLOWER')}</Text>
              </Flex>
            </TextButton>
            <TextButton fontSize="md">
              <Flex direction="column" justify="center" align="center">
                <Suspense fallback={<h1>로딩!!!</h1>}>
                  <QueryFetcher
                      queryFn={() => fetchFollowingByUid(profile.uid)}
                      queryOpt={groupOptions('following')}
                      renderFn={(data) => data?.length || 0}
                    />
                </Suspense>
                <Text>{translation('FOLLOWING')}</Text>
              </Flex>
            </TextButton>
          </Flex>
        </Flex>
        <Spacing size={24} />
        <Flex justify="space-between">
          <Flex direction="column">
            <Text>{profile?.displayName || "이름미지정"}</Text>
            <Text fontSize="sm" color="gray">{profile?.email}</Text>
          </Flex>
          {profile?.uid && profile?.uid !== user?.uid ? (
            <FollowBtn targetUid={profile.uid} /> 
          ) : (
            <TextButton>
              <Link to="/profile/edit">{translation('EDIT')}</Link>
            </TextButton>
          )}
        </Flex>
      </Flex>
      <Spacing size={16} />
      <Divider color="gray" />
      <Spacing size={16} />
      <Flex gap={16}>
        <TextButton color={activeTab === 'myPosts' ? 'white' : 'gray'} onClick={() => setActiveTab('myPosts')}>
          {translation('POST')}
        </TextButton>
        {profile?.uid === user?.uid && (
          <TextButton color={activeTab === 'likePosts' ? 'white' : 'gray'} onClick={() => setActiveTab('likePosts')}>
            {translation('LIKE')}
          </TextButton>
        )}
      </Flex>
      <Spacing size={30} />
      <Flex direction="column">
        {activeTab === 'myPosts' && (
          <Suspense fallback={<h1>로딩중이라고!!</h1>}>
            <QueryFetcher
              queryFn={() => fetchPostsByUid(profile.uid)}
              queryOpt={groupOptions('postList')}
              renderFn={(data) => data?.map((post: PostType) => <PostItem key={post?.id} post={post} />)}
            />
          </Suspense>
        )}
        {activeTab === 'likePosts' && profile?.uid === user?.uid && (
          <Suspense fallback={<h1>로딩중이라고!!</h1>}>
            <QueryFetcher
              queryFn={() => fetchLikePostsByUid(profile.uid)}
              queryOpt={groupOptions('likePosts')}
              renderFn={(data) => data?.map((post: PostType) => <PostItem key={post?.id} post={post} />)}
            />
          </Suspense>
        )}
      </Flex>
    </Flex>
  );
}
// import { Suspense, useContext, useEffect, useState } from "react";
// import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
// import AuthContext from "context/AuthContext";
// import { Link } from "react-router-dom";
// // 컴포넌트
// import QueryFetcher from "../shared/QueryFetcher";
// import PostItem from "components/shared/PostItem";
// import FollowBtn from "components/followBtn/FollowBtn";
// import { Spacing } from "components/shared/Spacing";
// import { Divider } from "components/shared/Divider";
// import { Flex } from "components/shared/Flex";
// import { TextButton } from "components/shared/TextButton";
// import { Text } from "components/shared/Text";
// // hooks
// import useTranslation from "hooks/useTranslation";
// // 데이터 타입
// import { PostType } from "interface";
// // remotes
// import { fetchFollowerByUid, fetchFollowingByUid, fetchLikePostsByUid, fetchPostsByUid } from "remotes/postAPI";
// import { fetchProfileById } from "remotes/profileAPI";
// import { UserImage } from "components/shared/UserImage";


// type TabType = 'myPosts' | 'likePosts';

// interface ProfileProps {
//   id: string;
// }
// export default function Profile({ id }: ProfileProps) {
//   const { user } = useContext(AuthContext);
//   const { translation } = useTranslation();
//   const [activeTab, setActiveTab] = useState<TabType>('myPosts');

//   useEffect(() => {
//     setActiveTab('myPosts');
//   }, []);

//   const { data: profile } = useSuspenseQuery({
//     queryKey: ['profile', id],
//     queryFn: () => fetchProfileById(id),
//     staleTime: Infinity,
//   });

//   // 쿼리옵션 생성
//   const groupOptions = (key: string) => {
//     return queryOptions({
//       queryKey: [key, profile.uid],
//       refetchOnWindowFocus: false,
//       staleTime: Infinity,
//     });
//   };
  
//   return (
//     <Flex direction="column">
//       <Flex direction="column">
//         <Flex justify="space-between">
//           <UserImage size={80} />
//           <Flex justify="space-between" align="center" gap={20}>
//             <TextButton fontSize="md">
//               <Flex direction="column" justify="center" align="center">
//                 <Suspense fallback={<h1>로딩!!!</h1>}>
//                   <QueryFetcher
//                     queryFn={() => fetchPostsByUid(profile.uid)}
//                     queryOpt={groupOptions('postList')}
//                     renderFn={(data) => data?.length}
//                   />
//                 </Suspense>
//                 <Text>{translation('POST')}</Text>
//               </Flex>
//             </TextButton>
//             <TextButton fontSize="md">
//               <Flex direction="column" justify="center" align="center">
//                 <Suspense fallback={<h1>로딩!!!</h1>}>
//                   <QueryFetcher
//                       queryFn={() => fetchFollowerByUid(profile.uid)}
//                       queryOpt={groupOptions('follower')}
//                       renderFn={(data) => data?.length || 0}
//                     />
//                 </Suspense>
//                 <Text>{translation('FOLLOWER')}</Text>
//               </Flex>
//             </TextButton>
//             <TextButton fontSize="md">
//               <Flex direction="column" justify="center" align="center">
//                 <Suspense fallback={<h1>로딩!!!</h1>}>
//                   <QueryFetcher
//                       queryFn={() => fetchFollowingByUid(profile.uid)}
//                       queryOpt={groupOptions('following')}
//                       renderFn={(data) => data?.length || 0}
//                     />
//                 </Suspense>
//                 <Text>{translation('FOLLOWING')}</Text>
//               </Flex>
//             </TextButton>
//           </Flex>
//         </Flex>
//         <Spacing size={24} />
//         <Flex justify="space-between">
//           <Flex direction="column">
//             <Text>{profile?.displayName || "이름미지정"}</Text>
//             <Spacing size={6} />
//             <Text fontSize="sm" color="gray">{profile?.email}</Text>
//           </Flex>
//           {profile?.uid && profile?.uid !== user?.uid ? (
//             <FollowBtn targetUid={profile.uid} /> 
//           ) : (
//             <TextButton>
//               <Link to="/profile/edit">{translation('EDIT')}</Link>
//             </TextButton>
//           )}
//         </Flex>
//       </Flex>
//       <Spacing size={16} />
//       <Divider color="gray" />
//       <Spacing size={16} />
//       <Flex gap={16}>
//         <TextButton color={activeTab === 'myPosts' ? 'white' : 'gray'} onClick={() => setActiveTab('myPosts')}>
//           {translation('POST')}
//         </TextButton>
//         {profile?.uid === user?.uid && (
//           <TextButton color={activeTab === 'likePosts' ? 'white' : 'gray'} onClick={() => setActiveTab('likePosts')}>
//             {translation('LIKE')}
//           </TextButton>
//         )}
//       </Flex>
//       <Spacing size={30} />
//       <Flex direction="column">
//         {activeTab === 'myPosts' && (
//           <Suspense fallback={<h1>로딩중이라고!!</h1>}>
//             <QueryFetcher
//               queryFn={() => fetchPostsByUid(profile.uid)}
//               queryOpt={groupOptions('postList')}
//               renderFn={(data) => data?.map((post: PostType) => <PostItem key={post?.id} post={post} />)}
//             />
//           </Suspense>
//         )}
//         {activeTab === 'likePosts' && profile?.uid === user?.uid && (
//           <Suspense fallback={<h1>로딩중이라고!!</h1>}>
//             <QueryFetcher
//               queryFn={() => fetchLikePostsByUid(profile.uid)}
//               queryOpt={groupOptions('likePosts')}
//               renderFn={(data) => data?.map((post: PostType) => <PostItem key={post?.id} post={post} />)}
//             />
//           </Suspense>
//       )}
//       </Flex>
//     </Flex>
//   );
// }