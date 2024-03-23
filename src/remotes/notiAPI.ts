import { collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "firebaseApp";
// type & schema
import { NotificationType } from "interface";
import { NotificationSchema } from "interface/zod";

// 알림 리스트 요청
export const fetchNotiListByUid = async (uid: string): Promise<NotificationType[]> => {
  const notiRef = collection(db, 'notifications')
  const notiQuery = query(notiRef, where('uid', '==', uid))
  const result = await getDocs(notiQuery)

  return result?.docs?.map(item => NotificationSchema.parse(({ ...item?.data(), id: item?.id })));
};

// 알림 업데이트
export const updateNotiById = async (notiId: string) => {
  const notiRef = doc(db, 'notifications', notiId);
  await updateDoc(notiRef, { isRead: true });
};

// 알림 삭제
export const deleteNotiById = async (notiId: string) => {
  const notiRef = doc(db, 'notifications', notiId);
  await deleteDoc(notiRef);
};