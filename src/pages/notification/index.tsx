import { useCallback, useContext, useEffect, useState } from "react"
import AuthContext from "context/AuthContext"
import { collection, onSnapshot, query, where } from "firebase/firestore"
import { db } from "firebaseApp"
// components
import NotiItem from "components/notification/NotiItem"
// 데이터 타입
import { NotificationType } from "interface"
// hooks
import useTranslation from "hooks/useTranslation"


export default function NotificationPage() {
    const { user } = useContext(AuthContext)
    const [ notifications, setNotifications ] = useState<NotificationType[]>([])
    const { translation } = useTranslation()

    // 알림 요청 함수
    const fetchNotifications = useCallback(() => {
        if(user?.uid) {
            const notiRef = collection(db, 'notifications')
            const notiQuery = query(notiRef, where('uid', '==', user?.uid))

            onSnapshot(notiQuery, (snapshot) => {
                const result = snapshot?.docs?.map((item) => ({ ...item?.data(), id : item?.id }))
                setNotifications(result as NotificationType[])
            })
        }
    }, [user?.uid])

    // 알림 가져오기
    useEffect(() => {
        if(user?.uid) fetchNotifications()
    }, [fetchNotifications, user?.uid])
    
    return (
        <div className="">
            <div className="page-header">
                { translation('MENU_NOTI') }
            </div>
            <div>
                { notifications?.map((item) => <NotiItem key={item?.id} notification={item}/>) }
            </div>
        </div>
    )
}