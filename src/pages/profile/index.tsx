import { Suspense, useContext } from "react";
// components
import Loader from "components/UI/Loader";
import Profile from "components/profile/Profile";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import { ProfileType } from "interface";
import { useQuery } from "@tanstack/react-query";


export default function ProfilePage() {
    const { id } = useParams()
    
    // 유저 프로필 요청함수
    const fetchProfile = async () => {
        if(id) {
            const profileRef = doc(db, 'profiles', id)
            const result = await getDoc(profileRef)
            
            if(!result.exists()) {
                return null
            }
            return { ...result?.data(), uid : result?.id } as ProfileType
        }
    }
   
    // 유저 프로필
    const { data : profile } = useQuery({ 
        queryKey : [`profile-${id}`],
        queryFn : fetchProfile,
        staleTime : 30000,
     })

     
    return (
        <Suspense fallback={ <Loader/> }>
            { profile && <Profile profile={ profile }/> }
        </Suspense>
    )
}