import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from 'firebaseApp';
import { FollowType, PostType } from 'interface';
import { FollowSchema, PostSchema } from 'interface/zod';

// 게시글 리스트 요청
export const fetchPostsByUid = async (uid: string): Promise<PostType[]> => {
  const postsRef = collection(db, 'posts');
  const postsQuery = query(postsRef, where('uid', '==', uid), orderBy('createdAt', 'desc'));
  const response = await getDocs(postsQuery);
  console.log(uid)
  return response?.docs?.map(doc => (PostSchema.parse({ ...doc?.data(), id: doc?.id })));
};

// 좋아요 게시글 리스트 요청
export const fetchLikePostsByUid = async (uid: string): Promise<PostType[]> => {
  const postsRef = collection(db, 'posts');
  const likePostsQuery = query(postsRef, where('likes', 'array-contains', uid), orderBy('createdAt', 'desc'));
  const response = await getDocs(likePostsQuery);

  return response?.docs.map(doc => PostSchema.parse({ ...doc.data(), id: doc?.id }));
};

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