import { useContext } from "react"
import AuthContext from "context/AuthContext"
import { useQuery } from "react-query"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "firebaseApp"
// components
import NotiItem from "components/notification/NotiItem"
// 데이터 타입
import { NotificationType } from "interface"
// hooks
import useTranslation from "hooks/useTranslation"


export default function NotificationPage() {
    const { user } = useContext(AuthContext)
    const { translation } = useTranslation()

    // 알림 요청 함수
    const fetchNotifications = async () => {
        if(user?.uid) {
            const notiRef = collection(db, 'notifications')
            const notiQuery = query(notiRef, where('uid', '==', user?.uid))
            const result = await getDocs(notiQuery)

            return result?.docs?.map((item) => ({ ...item?.data(), id : item?.id })) as NotificationType[]
        }
    }

    // 알림 가져오기
    const { data : notifications, isLoading } = useQuery([`notifications`], fetchNotifications, {
        enabled : !!user?.uid,
        refetchOnWindowFocus : false,
        staleTime : 100000,
    })

    
    return (
        <div className="">
            <div className="page-header">
                { translation('MENU_NOTI') }
            </div>
            <div>
                { isLoading ? <div>Loading..</div> :
                notifications?.map((item) => <NotiItem key={item?.id} notification={item}/>) }
            </div>
        </div>
    )
}