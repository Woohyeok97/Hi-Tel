import { useContext } from 'react';
import AuthContext from 'context/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from 'firebaseApp';
import { Link } from "react-router-dom";
import styled from '@emotion/styled';
// components
import { Flex } from '../shared/Flex';
import { TextButton } from '../shared/TextButton';
import { Text } from '../shared/Text';
import { Spacing } from '../shared/Spacing';
import { HashTag } from './HashTag';
import { UserImage } from '../shared/UserImage';
// hooks
import useTranslation from 'hooks/useTranslation';
// 데이터 타입
import { PostType } from "interface";


interface PostItemProps {
  post: PostType;
}
export default function PostItem({ post }: PostItemProps) {
  const queryClient = useQueryClient();
  const { user } = useContext(AuthContext);
  const { translation } = useTranslation();
      // 게시글삭제 로직
  const deleteMutation = useMutation({
    mutationFn: async () => {
        const postRef = doc(db, 'posts', post?.id);
        await deleteDoc(postRef);
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['postList'] });
        console.log('삭제하셨습니다.');
    },
    onError: (err: any) => {
        console.log(err?.code);
    }
  });

  // 삭제 핸들러
  const handlePostDelete = () => {
    const confirm = window.confirm('삭제하시겠습니까?');
    if (confirm && post?.uid === user?.uid) {
      deleteMutation.mutate();
    }
  };

  return (
    <>
      <Flex gap={12} justify="space-between">
        {/* <div className="user-img"></div> */}
        <UserImage />
        <PostItemStyled>
          <Flex direction="column" gap={6}>
            <Flex justify="space-between">
              <TextButton>
                <Link to={`/profile/${post?.uid}`}>{post?.displayName || post?.email}</Link>
              </TextButton>
              {post?.uid === user?.uid && (
                <Flex gap={10}>
                  <Link to={`/post/edit/${post?.id}`}>
                    <TextButton color="gray" fontSize="sm">{translation('EDIT')}</TextButton>
                  </Link>
                  <TextButton color="orangered" fontSize="sm" onClick={handlePostDelete}>
                    {translation('DELETE')}
                  </TextButton>
                </Flex>
              )}
            </Flex>
            <Text fontSize="xs" color="gray">{post?.createdAt}</Text>
          </Flex>
          <Spacing size={20} />
          <Link to={`/post/${post?.id}`}>
            <Text>{post?.content}</Text>
          </Link>
          <Spacing size={12} />
          <Flex gap={10}>
            {post?.hashTag?.length > 0 && post?.hashTag?.map(item => (
              <HashTag key={item}>
                #{item}
              </HashTag>
            ))}
          </Flex>
          <Spacing size={20} />  
          <Flex gap={10}>
            <Text fontSize="sm">{translation('LIKE')}: {post?.likeCount || 0}</Text>
            <Text fontSize="sm">{translation('COMMENT')}: {post?.comments?.length || 0}</Text>
          </Flex>
        </PostItemStyled>
      </Flex>
      <Spacing size={46} />
    </>
  );
}

const PostItemStyled = styled.div`
  flex-grow: 1;
`;