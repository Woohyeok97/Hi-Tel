import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from 'firebaseApp';
import { PostType } from 'interface';
import { PostSchema } from 'interface/zod';

// 게시글 리스트 요청
export const fetchPostsById = async (Id: string): Promise<PostType> => {
  const postRef = doc(db, 'posts', Id);
  const response = await getDoc(postRef);

  return PostSchema.parse({ id: response?.id, ...response?.data() });
};

// 작성한 게시글 리스트 요청
export const fetchPostsByUid = async (uid: string): Promise<PostType[]> => {
  const postsRef = collection(db, 'posts');
  const postsQuery = query(postsRef, where('uid', '==', uid), orderBy('createdAt', 'desc'));
  const response = await getDocs(postsQuery);

  return response?.docs?.map(doc => (PostSchema.parse({ ...doc?.data(), id: doc?.id })));
};

// 좋아요 게시글 리스트 요청
export const fetchLikePostsByUid = async (uid: string): Promise<PostType[]> => {
  const postsRef = collection(db, 'posts');
  const likePostsQuery = query(postsRef, where('likes', 'array-contains', uid), orderBy('createdAt', 'desc'));
  const response = await getDocs(likePostsQuery);

  return response?.docs.map(doc => PostSchema.parse({ ...doc.data(), id: doc?.id }));
};

// 검색 게시글 요청
export const fetchPostsBySearch = async (search: string): Promise<PostType[]> => {
  const postsRef = collection(db, 'posts');
  const postsQuery = query(postsRef, where('hashTag', 'array-contains', search), orderBy('createdAt', "desc"))
  const response = await getDocs(postsQuery);

  return response?.docs?.map(doc => (PostSchema.parse({ ...doc?.data(), id: doc?.id })));
};