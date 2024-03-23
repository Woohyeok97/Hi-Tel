import { doc, getDoc } from "firebase/firestore";
import { db } from "firebaseApp";
// type & schema
import { FollowType } from "interface";
import { FollowSchema } from "interface/zod";

// 팔로잉 목록 요청
export const fetchFollowingByUid = async (uid: string): Promise<string[]> => {
  const followingRef = doc(db, 'following', uid);
  const response = await getDoc(followingRef);

  return response?.data()?.users.map((user: FollowType) => FollowSchema.parse(user).uid);
};

// 팔로워 목록 요청
export const fetchFollowerByUid = async (uid: string): Promise<string> => {
  const followerRef = doc(db, 'follower', uid);
  const response = await getDoc(followerRef);

  return response?.data()?.users.map((user: FollowType) => FollowSchema.parse(user).uid);
};
