import { doc, getDoc } from 'firebase/firestore';
import { db } from 'firebaseApp';
import { ProfileType } from 'interface';
import { ProfileSchema } from 'interface/zod';

// 유저 프로필 요청
export const fetchProfileById = async (id: string): Promise<ProfileType> => {
  const profileRef = doc(db, 'profiles', id);
  const response = await getDoc(profileRef);

  return ProfileSchema.parse({ ...response?.data(), uid: response?.id });
};