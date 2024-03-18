import { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AuthContext from "context/AuthContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { arrayRemove, arrayUnion, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "firebaseApp";
// hooks
import useTranslation from 'hooks/useTranslation';
// components
import CommentForm from "components/comment/CommentForm";
import CommentItem from "components/comment/CommentItem";
// 데이터 타입
import { PostType } from "interface";
import { TextButton } from "components/shared/TextButton";
import { Text } from "components/shared/Text";
import { Flex } from "components/shared/Flex";
import { HashTag } from "components/shared/HashTag";
import { Spacing } from "components/shared/Spacing";
import { Divider } from "components/shared/Divider";

export default function PostPage() {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { translation } = useTranslation();


  const fetchPost = async () => {
    if (id) {
      const postRef = doc(db, 'posts', id);
      const result = await getDoc(postRef);
      
      if(!result.exists()) {
        return null;
      }
      return { ...result?.data(), id: result?.id } as PostType;
    }
  };

  const { data: post, isError, isLoading } = useQuery({
    queryKey: [`post-${id}`],
    queryFn: fetchPost,
    enabled: !!id,
    staleTime: 100000,
  });


  const deleteMutation = useMutation({
    mutationFn: async (postId : string) => {
      const confirm = window.confirm('삭제하시겠습니까?');
      if (!confirm) return;
      
      const postRef = doc(db, 'posts', postId);
      await deleteDoc(postRef);
    },
    onSuccess: () => {
        navigate('/');
        console.log('삭제하셨습니다.');
    },
    onError: (err : any) => {
      console.log(err?.code);
    }
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      if (!user?.uid) {
        console.log('접속이후 이용해주십시오.')
        return;
      }

      if (!post) return;

      const postRef = doc(db, 'posts', post?.id);

      if (post?.likes?.includes(user?.uid)) {
          await updateDoc(postRef, {
            likes: arrayRemove(user?.uid),
            likeCount: post?.likeCount ? post?.likeCount - 1 : 0
          });
          console.log('추천을 취소하셨습니다.');
      } else {
          await updateDoc(postRef, {
            likes: arrayUnion(user?.uid),
            likeCount: post?.likeCount ? post?.likeCount + 1 : 1
          });
          console.log('게시글을 추천하셨습니다.');
      }
    },
    onSuccess: () => {
        // queryClient.invalidateQueries(`post-${post?.id}`);
        // queryClient.invalidateQueries(`likePosts`);
    },
    onError: (err: any) => {
       console.log(err?.code);
    }
  });

  if(isLoading) return <div>Loading..</div>

  if(isError) return <div>에러발생</div>

  if(!post) return <div>해당 게시글은 없습니다.</div> 

  return (
    <>
      {post?.id && (
        <Flex direction="column">
          <Flex align="center" gap={16}>
            <div className="user-img"></div>
            <Flex direction="column" gap={4}>
              <TextButton>
                <Link to={`/profile/${post?.uid}`}>
                  {post?.displayName || post?.email}
                </Link>
              </TextButton>
              <Text color="gray">{post?.createdAt}</Text>
            </Flex>
          </Flex>
          <Spacing size={24} />
          <Text>{post?.content}</Text>
          <Spacing size={40} />
          <Flex gap={10}>
            {post?.hashTag?.length > 0 && post.hashTag.map(item => <HashTag key={item}>#{item}</HashTag>)}
          </Flex>
          <Spacing size={16} />

          <Flex justify="space-between">
            <Flex gap={20}>
              <TextButton
                color={user?.uid && post?.likes?.includes(user?.uid) ? 'orangered' : 'white'}
                onClick={() => likeMutation.mutate() }
              >
                {translation('LIKE')}: {post?.likeCount || 0}
              </TextButton>
              <Text>{translation('COMMENT')} : {post?.comments?.length || 0}</Text>
            </Flex>
            {post?.uid === user?.uid && (
              <Flex gap={12}>
                <TextButton>
                  <Link to={`/post/edit/${post?.id}`}>{translation('EDIT')}</Link>
                </TextButton>
                <TextButton onClick={() => deleteMutation.mutate(post?.id)} color="orangered">
                  {translation('DELETE')}
                </TextButton>
              </Flex>
            )}
          </Flex>
          <Spacing size={24} />
          <Divider color="gray" size={2} />
          <Spacing size={30} />
          <Flex direction="column" justify="space-between">
            {post?.comments?.map(item => (
              <CommentItem key={item?.uid + item?.createdAt} comment={item} post={post} />
            ))}
            <CommentForm post={ post }/>
          </Flex>
        </Flex>
      )}
    </>
  );
}