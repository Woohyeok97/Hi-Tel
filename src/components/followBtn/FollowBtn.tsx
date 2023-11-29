import styles from './FollowBtn.module.scss'
import { useCallback, useContext, useEffect, useState } from "react"
import AuthContext from "context/AuthContext"
import { arrayRemove, arrayUnion, doc, onSnapshot, setDoc } from "firebase/firestore"
import { db } from "firebaseApp"
// 데이터 타입
import { FollowType } from "interface"


interface FollowBtnProps {
    targetUid : string,
}

export default function FollowBtn({ targetUid } : FollowBtnProps) {
    const { user } = useContext(AuthContext)
    const [ followingList, setFollowingList ] = useState<string[] | null>(null)

    // 팔로잉리스트 요청 함수   
    const fetchFollowing = useCallback(async () => {
        if(user?.uid) {
            const followingRef = doc(db, 'following', user?.uid)

            onSnapshot(followingRef, (doc) => {
                const result = doc?.data()?.users?.map((item : FollowType) => item?.uid)
                setFollowingList(result)
            })
        }
    }, [user?.uid])


    // 팔로우 핸들러
    const handleFollow = async () => {
        if(!user?.uid) {
            console.log('접속이후 이용해 주십시오.')
            return
        }
        try {
            const followingRef = doc(db, 'following', user?.uid)
            const followerRef = doc(db, 'follower', targetUid)
            
            await setDoc(followingRef, {
                users : arrayUnion({ uid : targetUid })
            })
            await setDoc(followerRef, {
                users : arrayUnion({ uid : user?.uid })
            })

            console.log('해당 회원님을 팔로우 하셨습니다.')
        } catch(err : any) {
            console.log(err?.code)
        }
    }

    // 언팔로우 핸들러
    const handleUnfollow = async () => {
        if(!user?.uid) {
            return
        }
        try {
            const followingRef = doc(db, 'following', user?.uid)
            const followerRef = doc(db, 'follower', targetUid)

            await setDoc(followingRef, {
                users : arrayRemove({ uid : targetUid })
            })
            await setDoc(followerRef, {
                users : arrayRemove({ uid : user?.uid })
            })

            console.log('팔로우를 취소하셨습니다.')
        } catch(err : any) {
            console.log(err?.code)
        }
    }

    // 팔로잉리스트 가져오기
    useEffect(() => {
        if(user?.uid) fetchFollowing()
    }, [fetchFollowing, user?.uid])


    return (
        <> { followingList && user?.uid !== targetUid && // 로그인정보와 targetUid가 다를때만 렌더링
            <div className={ styles.followBox }>
                { followingList?.includes(targetUid) ? 
                <div className={ styles.followBox__following } onClick={ handleUnfollow }>
                    팔로잉
                </div>
                : 
                <div className={ styles.followBox__follow } onClick={ handleFollow }>
                    팔로우
                </div> }
            </div>
        } </>
    )
}