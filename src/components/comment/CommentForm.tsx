import { useContext, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import AuthContext from 'context/AuthContext';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { db } from 'firebaseApp';
// components
import { Flex } from 'components/shared/Flex';
// hooks
import useNotification from 'hooks/useNotification';
import useTranslation from 'hooks/useTranslation';
// type
import { PostType } from 'interface';
import { TextField } from 'components/shared/TextField';
import { Input } from 'components/shared/Input';
import { Spacing } from 'components/shared/Spacing';


interface CommentFormProps {
  post: PostType;
}
export default function CommentForm({ post }: CommentFormProps) {
  const { user } = useContext(AuthContext);
  const [content, setContent] = useState('');
  const queryClient = useQueryClient();
  const { createNotification } = useNotification({ targetUid: post?.uid });
  const { translation } = useTranslation();

  const commentMutation = useMutation({
    mutationFn: async () => {
      const postRef = doc(db, 'posts', post?.id)
      const insertComment = {
          uid : user?.uid,
          displayName : user?.displayName,
          email : user?.email,
          content : content,
          createdAt : new Date().toLocaleDateString("ko", {
              hour : '2-digit',
              minute : '2-digit',
              second : '2-digit'
          }), 
      }
      await updateDoc(postRef, {
        comments: arrayUnion(insertComment)
      })
    },
    onSuccess: async () => {
      if (post?.uid !== user?.uid) {
        await createNotification('회원님 게시글에 덧글이 생성되었습니다.', `/post/${post?.id}`)
      }
      setContent('') // 댓글작성후, content초기화
      queryClient.invalidateQueries({ queryKey: [`post-${post?.id}`] })
      console.log('덧글을 작성하였습니다.')
    },
    onError: (err: any) => {
      console.log(err?.code)
    }
  });

  // submit 핸들러
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault()
    commentMutation.mutate()
  };

  // content 핸들러
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e?.target;
    setContent(value)
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Flex direction="column" align="flex-end">
          <TextField
            onChange={handleContentChange}
            value={content}
            placeholder={user?.uid ? '덧글을 입력하십시오.' : '접속이후 이용해주십시오.'}
            disabled={!user?.uid}
          />
          <Spacing size={6} />
          <Input type="submit" value={translation('COMMENT')} disabled={!user?.uid || !content} />
        </Flex>
      </form>
      <Spacing size={24} />
    </>
  );
}