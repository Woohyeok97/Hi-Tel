import { addDoc, collection } from "firebase/firestore"
import { db } from "firebaseApp"

interface HookProps {
    targetUid : string,
}
export default function useNotification({ targetUid } : HookProps) {

    // 알림생성 함수
    const createNotification = async (message : string, url? : string) => {
        const notiRef = collection(db, 'notifications')
        const insertNoti = {
            uid : targetUid,
            content : message,
            url : url,
            createdAt : new Date().toLocaleDateString("ko", {
                hour : '2-digit',
                minute : '2-digit',
                second : '2-digit'
            }),
            isRead : false,
        }
        // 알림doc 생성
        await addDoc(notiRef, insertNoti)
    }
    

    return { createNotification }
}