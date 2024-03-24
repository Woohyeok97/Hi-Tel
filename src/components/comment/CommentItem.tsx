import { useContext } from 'react';
import AuthContext from 'context/AuthContext';
import { Link } from 'react-router-dom';
// components
import { Flex } from 'components/shared/Flex';
import { UserImage } from 'components/shared/UserImage';
import { TextButton } from 'components/shared/TextButton';
import { Text } from 'components/shared/Text';
import { Spacing } from 'components/shared/Spacing';
// hooks
import useTranslation from 'hooks/useTranslation';
// 데이터타입
import { CommentType, PostType } from 'interface';
import { arrayRemove, doc, updateDoc } from 'firebase/firestore';
import { db } from 'firebaseApp';
import { useMutation, useQueryClient } from '@tanstack/react-query';


interface CommentItemProps {
  comment: CommentType;
  post: PostType;
}

export default function CommentItem({ comment, post }: CommentItemProps) {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const { translation } = useTranslation();

  // 댓글삭제 로직
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const postRef = doc(db, 'posts', post?.id);
      await updateDoc(postRef, {
        comments: arrayRemove(comment)
      });
    },
    onSuccess: () => {
      console.log('덧글을 삭제하였습니다.');
      queryClient.invalidateQueries({ queryKey: [`post-${post?.id}`] });
    },
    onError: (err: any) => {
      console.log(err?.code);
    }
  });

  // 댓글삭제 핸들러
  const handleDelete = () => {
    const confirm = window.confirm('삭제하시겠습니까?');
    if (confirm && comment?.uid === user?.uid) {
      deleteMutation.mutate();
    }
  };

  return (
    <>
      <Flex gap={20}>
        <UserImage />
        <Flex direction="column" gap={6}>
          <Flex justify="space-between">
            <TextButton>
              <Link to={`/profile/${comment.uid}`}>
                {comment.displayName || comment.email}
              </Link>
            </TextButton>
            {comment.uid === user?.uid && (
              <TextButton onClick={handleDelete} color="orangered" fontSize="sm">
                {translation('DELETE')}
              </TextButton>
            )}
          </Flex>
          <Flex direction="column" gap={12}>
            <Text>{comment.content}</Text>
            <Text color="gray" fontSize="sm">
              {comment.createdAt}
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Spacing size={40} />
    </>
  );
}