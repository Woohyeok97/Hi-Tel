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
import { PostType } from "interface";
// remotes
import { fetchFollowerByUid, fetchFollowingByUid, fetchLikePostsByUid, fetchPostsByUid } from "remotes/postAPI";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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

  const { data: profile } = useQuery({
    queryKey: ['profile', id],
    queryFn: () => fetchProfileById(id),
    refetchOnWindowFocus: false,
    enabled: !!id,
    staleTime: Infinity,
  });

  const profileUid = profile?.uid ?? "";

  const queryOptions = {
    refetchOnWindowFocus: false,
    enabled: !!profileUid,
    staleTime: Infinity,
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
                    queryKey={['postList', profileUid]}
                    queryFn={() => fetchPostsByUid(profileUid)}
                    queryOpt={queryOptions}
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
                    queryKey={['follower', profileUid]}
                    queryFn={() => fetchFollowerByUid(profileUid)}
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
                    queryKey={['following', profileUid]}
                    queryFn={() => fetchFollowingByUid(profileUid)}
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
          
          {profile?.uid && profile?.uid !== user?.uid ? (
            <FollowBtn targetUid={profileUid} /> 
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
            queryKey={['postList', profileUid]}
            queryFn={() => fetchPostsByUid(profileUid)}
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
            queryKey={['likePosts', profileUid]}
            queryFn={() => fetchLikePostsByUid(profileUid)}
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