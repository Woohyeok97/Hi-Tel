import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "firebaseApp";
// components
import PostItem from "components/shared/PostItem";
import { Spacing } from "components/shared/Spacing";
// 데이터 타입
import { PostType } from "interface";

export default function HomePage() {
  const fetchPostList = async () => {
    const postsRef = collection(db, 'posts');
    const postsQuery = query(postsRef, orderBy('createdAt', 'desc'));
    const result = await getDocs(postsQuery);

    return result?.docs?.map((item) => ({ ...item?.data(), id : item?.id })) as PostType[];
  };

  const { data: postList, isError, isLoading } = useQuery({
    queryKey: [`postList`],
    queryFn: fetchPostList,
    staleTime: 30000,
  });

  if (isError) return <div>에러발생</div>;

  if (isLoading) return <div>하이텔</div>;
    
  return (
    <>
      <Spacing size={6} />
      {postList?.map((item) => <PostItem key={item?.id} post={item} />)}
    </>
  );
}