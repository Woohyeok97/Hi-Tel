import { useQueries } from '@tanstack/react-query';
import useTranslation from 'hooks/useTranslation';
import { fetchFollowerByUid, fetchFollowingByUid, fetchPostsByUid } from 'remotes/postAPI';

interface UserDataProps {
  uid: string;
}
export default function UserInfo({ uid }: UserDataProps) {
  const { translation } = useTranslation();
  const opt = {
    enabled: !!uid,
    refetchOnWindowFocus: false,
    suspense: true,
  };

  const [posts, follower, following] = useQueries({
    queries: [
      {
        queryKey: ['postList', uid],
        queryFn: () => fetchPostsByUid(uid),
        ...opt,
      },
      {
        queryKey: ['follower', uid],
        queryFn: () => fetchFollowerByUid(uid),
        ...opt,
      },
      {
        queryKey: ['following', uid],
        queryFn: () => fetchFollowingByUid(uid),
        ...opt,
      },
    ],
  });

  return (
    <div className="flex justify-between pb-5 md:pb-10">
      <img className="profile-img"/>

      <div className="flex justify-between gap-5 lg:gap-10">
        <div className={`flex flex-col text-btn justify-center items-center cursor-pointer lg-text`}>
          <div className="lg-text">
            { posts?.data?.length || 0 }
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
  );
}