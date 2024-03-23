import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { addDoc, collection } from "firebase/firestore";
import { db } from "firebaseApp";
// components
import { Flex } from "components/shared/Flex";
import { Spacing } from "components/shared/Spacing";
import { Text } from "components/shared/Text";
import { TextField } from "components/shared/TextField";
import { TextButton } from "components/shared/TextButton";
import { HashTag } from "components/post/HashTag";
import { Input } from "components/shared/Input";
// hooks
import useTranslation from "hooks/useTranslation";


export default function NewPostPage() {
  const { user } = useContext(AuthContext);
  const { translation } = useTranslation();
  const [ hashTagList, setHashTagList ] = useState<string[]>([]);
  const [ content, setContent ] = useState<string>('');
  // 입력중인 해쉬태그
  const [ hashTag, setHashTag ] = useState<string>('');
  const queryClient = useQueryClient();
  const navigate = useNavigate();

     // submit 핸들러
     const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
      e?.preventDefault()

      try {
          const postRef = collection(db, 'posts')
          const insertPost = {
              uid : user?.uid,
              displayName : user?.displayName,
              email : user?.email,
              content : content,
              hashTag : hashTagList, 
              createdAt : new Date().toLocaleDateString("ko", {
                  hour : '2-digit',
                  minute : '2-digit',
                  second : '2-digit'
              }),         
          }
          // 게시글 업로드
          await addDoc(postRef, insertPost)

          queryClient.invalidateQueries({ queryKey : ['postList'] })
          navigate('/')
          console.log('게시글을 작성하셨습니다.')
      } catch(err : any) {
          console.log(err?.code)
      }
  };

  // content 핸들러
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e?.target;
    setContent(value);
  };

  // hashTag 핸들러
  const handleHashTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e?.target;
    setHashTag(value.trim());
  };

  // hashTag삭제 핸들러
  const handleHashTagDelete = (hash: string) => {
    setHashTagList(prev => prev.filter(item => item !== hash));
  };

  // 해쉬태그 추가 핸들러
  const handleAddHashTag = (e: any) => {
    const SPACE_KEY_CODE = 32 // 스페이스바 키코드
    // 스페이스바를 입력하면 입력중인 해쉬태그를 해쉬태그리스트에 추가
    if (hashTag && e?.keyCode === SPACE_KEY_CODE) {
      // 해쉬태그 추가 유효성검사
      if (hashTagList.length >= 3) {
        console.log('해쉬태그는 3개까지만 입력하십시오.');
      } else if (hashTagList.includes(hashTag)) {
        console.log('이미 입력하셨습니다.');
      } else {
        setHashTagList((prev) => [...prev, hashTag.trim()]);
      }
      setHashTag('');
    }  
  };

  return (
    <>
      <Text fontSize="lg">
        {`${translation('POST')} ${translation('WRITE')}`}
      </Text>
      <Spacing size={30} />
      <form onSubmit={handleSubmit}>
        <Flex direction="column" gap={12}>
          <TextField
            onChange={handleContentChange}
            placeholder="내용을 입력해주십시오."
            value={content}
          />
        </Flex>
        <Spacing size={8} />
        <Input 
          onChange={handleHashTagChange}
          onKeyUp={handleAddHashTag}
          value={hashTag}
          placeholder='> 해쉬태그 + 스페이스바 (최대 3개)'
        />
        <Spacing size={8} />
        <Flex gap={10}>
          {hashTagList?.length > 0 && hashTagList?.map(item => (
            <TextButton onClick={() => handleHashTagDelete(item)} key={item}>
              <HashTag>#{item}</HashTag>
            </TextButton>
          ))}
        </Flex>
        <Spacing size={8} />
        <Flex direction="row-reverse">
          <Input
            type="submit" 
            value={translation('MENU_WRITE')} 
            disabled={!content}
          />
        </Flex>
      </form>
    </>
  );
}
