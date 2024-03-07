import { Suspense, useContext, useEffect, useState } from "react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import AuthContext from "context/AuthContext";
import { Link } from "react-router-dom";
// 컴포넌트
import QueryFetcher from "./QueryFetcher";
import PostItem from "components/post/PostItem";
import FollowBtn from "components/followBtn/FollowBtn";
// hooks
import useTranslation from "hooks/useTranslation";
// 데이터 타입
import { PostType } from "interface";
// remotes
import { fetchFollowerByUid, fetchFollowingByUid, fetchLikePostsByUid, fetchPostsByUid } from "remotes/postAPI";
import { fetchProfileById } from "remotes/profileAPI";


type TabType = 'myPosts' | 'likePosts';

interface ProfileProps {
  id: string;
}
export default function Profile({ id }: ProfileProps) {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState<TabType>('myPosts');
  const { translation } = useTranslation();

  useEffect(() => {
    setActiveTab('myPosts')
  }, []);

  const { data: profile } = useSuspenseQuery({
    queryKey: ['profile', id],
    queryFn: () => fetchProfileById(id),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  // 쿼리옵션 생성
  // useSuspenseQuery 덕분에 profile.uid의 타입을 확정할 수잇음
  const groupOptions = (key: string) => {
    return queryOptions({
      queryKey: [key, profile.uid],
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    });
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
                    queryFn={() => fetchPostsByUid(profile.uid)}
                    queryOpt={groupOptions('postList')}
                    renderFn={(data) => data?.length}
                  />
                </Suspense>
              </div>
              <span>{ translation('POST') }</span>
            </div>
            <div className={`flex flex-col text-btn justify-center items-center cursor-pointer lg-text`}>
              <div className="lg-text">
                <Suspense fallback={<h1>로딩!!!</h1>}>
                  <QueryFetcher
                    queryFn={() => fetchFollowerByUid(profile.uid)}
                    queryOpt={groupOptions('follower')}
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
                    queryFn={() => fetchFollowingByUid(profile.uid)}
                    queryOpt={groupOptions('following')}
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
          
          {profile?.uid && profile?.uid !== user?.uid ? (
            <FollowBtn targetUid={profile.uid} /> 
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
            queryFn={() => fetchPostsByUid(profile.uid)}
            queryOpt={groupOptions('postList')}
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
            queryFn={() => fetchLikePostsByUid(profile.uid)}
            queryOpt={groupOptions('likePosts')}
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