import { useQuery } from '@tanstack/react-query';
import PostItem from 'components/post/PostItem';
import { PostType } from 'interface';

interface PostListProps {
  uid: string;
  fetch: (uid: string) => Promise<PostType[]>;
}
export default function PostList({ uid, fetch }: PostListProps) {
  const { data } = useQuery({
    queryKey: ['postList!!', uid],
    queryFn: () => fetch(uid),
    enabled: !!uid || !!fetch,
    refetchOnWindowFocus: false,
    suspense: true,
  });
  return (
    <div>
      {data?.map(item => <PostItem key={item?.id} post={ item }/>)}
    </div>
  );
}