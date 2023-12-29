import { useContext } from "react"
import AuthContext from "context/AuthContext"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { arrayRemove, arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { db } from "firebaseApp"
// hooks
import useNotification from 'hooks/useNotification'
// 데이터 타입
import { FollowType } from "interface"


interface FollowBtnProps {
    targetUid : string,
}

export default function FollowBtn({ targetUid } : FollowBtnProps) {
    const { user } = useContext(AuthContext)
    const queryClient = useQueryClient()
    const { createNotification } = useNotification({ targetUid : targetUid })

    // 팔로잉리스트 요청 함수   
    const fetchFollowing = async () => {
        if(user?.uid) {
            const followingRef = doc(db, 'following', user?.uid)
            const result = await getDoc(followingRef)

            return result?.data()?.users?.map((item : FollowType) => item?.uid)
        }
    }
    
    // 팔로잉리스트 가져오기
    const { data : followingList } = useQuery({
        queryKey : ['following-btn', user?.uid],
        queryFn : fetchFollowing,
        enabled : !!user?.uid, // 로그인상태
        refetchOnWindowFocus : false,
        staleTime : Infinity,
    })

    // 팔로우 로직
    const followMutation = useMutation({
        mutationFn : async () => {
            if(!user?.uid) {
                alert('접속이후 이용해 주십시오.')
                return
            }
            const followingRef = doc(db, 'following', user?.uid)
            const followerRef = doc(db, 'follower', targetUid)

            // 내가 팔로잉한 유저목록에 해당유저 추가
            await setDoc(followingRef, 
            { users : arrayUnion({ uid : targetUid }) },
            { merge : true }
            )

            // 나를 팔로우하는 유저목록에 로그인유저 추가
            await setDoc(followerRef, {
                users : arrayUnion({ uid : user?.uid })
            }, { merge : true })

        },
        onSuccess : async () => {
            // 알림
            await createNotification(
                `${user?.displayName || user?.email}님이 팔로우를 시작하였습니다.`,
                `/profile/${user?.uid}`
            )
            queryClient.invalidateQueries({ queryKey : ['following-btn'] })
            console.log('해당 회원님을 팔로우 하셨습니다.')
        },
        onError : (err : any) => {
            console.log(err?.code)
        }
    })

    // 언팔로우 로직
    const unFollowMutation = useMutation({
        mutationFn : async () => {
            if(!user?.uid) {
                alert('접속이후 이용해 주십시오.')
                return
            }

            const followingRef = doc(db, 'following', user?.uid)
            const followerRef = doc(db, 'follower', targetUid)

            // 내가 팔로잉한 유저목록에 해당유저 삭제
            await updateDoc(followingRef, {
                users : arrayRemove({ uid : targetUid })
            })

            // 나를 팔로우하는 유저목록에 로그인유저 삭제
            await updateDoc(followerRef, {
                users : arrayRemove({ uid : user?.uid })
            })
        },
        onSuccess : async () => {
            queryClient.invalidateQueries({ queryKey : ['following-btn'] })
            console.log('팔로우를 취소하셨습니다.')
        },
        onError : (err : any) => {
            console.log(err?.code)
        }
    })


    return (
        <div className="flex items-center font-bold text-btn text-2xl">
            { followingList?.includes(targetUid) ? 
            <div className="px-4 py-3 rounded-xl border-3 border-blue-500" 
                onClick={ () => unFollowMutation.mutate() }>
                팔로잉
            </div>
            : 
            <div className="px-4 py-3 rounded-xl border-3 border-gray hover:border-4" 
                onClick={ () => followMutation.mutate() }>
                팔로우
            </div> }
        </div>
    )
}