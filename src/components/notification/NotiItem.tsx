import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from 'firebaseApp'
// hooks
import useTranslation from 'hooks/useTranslation'
// 데이터 타입
import { NotificationType } from 'interface'


interface NotiItemProps {
    notification : NotificationType,
}

export default function NotiItem({ notification } : NotiItemProps) {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { translation } = useTranslation()
    
    //알림삭제 핸들러 완성
    const handleNotiClick = async () => {
        // isRead가 false(알림확인전) 이라면 true로 업데이트
        if(!notification?.isRead) {
            try {
                const notiRef = doc(db, 'notifications', notification?.id)
                await updateDoc(notiRef, {
                    isRead : true,
                })

                queryClient.invalidateQueries({ queryKey : ['notifications'] })
            } catch(err : any) {
                console.log(err?.code)
            }
        }
        // notification?.url이 있다면 페이지 이동
        if(notification?.url) {
            navigate(notification?.url)
        }   
    }

    // 알림삭제 핸들러
    const handleNotiDelete = async () => {
        const confirm = window.confirm('알림을 삭제하시겠습니까?')

        if(confirm) {
            try {
                const notiRef = doc(db, 'notifications', notification?.id)
                await deleteDoc(notiRef)
                
                queryClient.invalidateQueries({ queryKey : ['notifications'] })
                console.log('알림을 삭제하셨습니다.')
            } catch(err : any) {
                console.log(err?.code)
            }
        }
    }


    return (
        <div className="flex flex-col bt-6 mb-12">
                <div className={`font-bold cursor-pointer py-3 ${ notification?.isRead
                ? 'text-gray hover:text-grayHover'
                : 'text-white hover:text-whiteHover'}`} onClick={ handleNotiClick }>
                    { notification?.content }
                </div>

            <div className='flex justify-between text-lg'>
                <div className="text-gray">{ notification?.createdAt }</div>
                <div className="delete-btn" onClick={ handleNotiDelete }>
                    { translation('DELETE') }
                </div>
            </div>
            
        </div>
    )
}