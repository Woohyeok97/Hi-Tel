import { useContext } from "react";
import AuthContext from "context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { arrayRemove, arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "firebaseApp";
// components
import { Flex } from "./Flex";
import { TextButton } from "./TextButton";
// hooks
import useNotification from 'hooks/useNotification';
import useTranslation from "hooks/useTranslation";
// remotes
import { fetchFollowingByUid } from "remotes/followAPI";

interface FollowBtnProps {
  targetUid: string;
}
export default function FollowBtn({ targetUid }: FollowBtnProps) {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const { createNotification } = useNotification({ targetUid: targetUid });
  const { translation } = useTranslation();

  const { data: followingList } = useQuery({
    queryKey: ['following', user?.uid],
    queryFn: () => fetchFollowingByUid(user?.uid!),
    enabled: !!user?.uid,
    staleTime: Infinity,
  });

  // 팔로우 로직
  const followMutation = useMutation({
    mutationFn : async () => {
      if (!user?.uid) {
          alert('접속이후 이용해 주십시오.')
          return
      }
      const followingRef = doc(db, 'following', user?.uid)
      const followerRef = doc(db, 'follower', targetUid)

      // 내가 팔로잉한 유저목록에 해당유저 추가
      await setDoc(followingRef, 
      { users : arrayUnion({ uid : targetUid }) },
      { merge : true }
      )

      // 나를 팔로우하는 유저목록에 로그인유저 추가
      await setDoc(followerRef, {
          users : arrayUnion({ uid : user?.uid })
      }, { merge : true })
  },
    onSuccess : async () => {
      // 알림
      await createNotification(
        `${user?.displayName || user?.email}님이 팔로우를 시작하였습니다.`,
        `/profile/${user?.uid}`
      )
      queryClient.invalidateQueries({ queryKey: ['following'] })
      console.log('해당 회원님을 팔로우 하셨습니다.')
    },
    onError : (err : any) => {
      console.log(err?.code)
    }
  });

  // 언팔로우 로직
  const unFollowMutation = useMutation({
    mutationFn : async () => {
      if (!user?.uid) {
        alert('접속이후 이용해 주십시오.')
        return
      }

      const followingRef = doc(db, 'following', user?.uid)
      const followerRef = doc(db, 'follower', targetUid)

      // 내가 팔로잉한 유저목록에 해당유저 삭제
      await updateDoc(followingRef, {
        users : arrayRemove({ uid : targetUid })
      })

      // 나를 팔로우하는 유저목록에 로그인유저 삭제
      await updateDoc(followerRef, {
        users : arrayRemove({ uid : user?.uid })
      })
    },
    onSuccess : async () => {
      queryClient.invalidateQueries({ queryKey: ['following'] })
      console.log('팔로우를 취소하셨습니다.')
    },
    onError : (err : any) => {
      console.log(err?.code)
    }
  });


  return (
    <Flex align="center">
      {followingList?.includes(targetUid) ? (
        <TextButton onClick={() => unFollowMutation.mutate()} color="blueLigth" fontSize="md">
          {translation('FOLLOWING')}
        </TextButton>
      ) : (
        <TextButton onClick={() => followMutation.mutate()} color="gray" fontSize="md">
          {translation('FOLLOWER')}
        </TextButton>
      )}
    </Flex>
  );
}