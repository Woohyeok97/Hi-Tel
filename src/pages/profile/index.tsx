import { Suspense } from "react";
// components
import Loader from "components/UI/Loader";
import Profile from "components/profile/Profile";


export default function ProfilePage() {

    return (
        <Suspense fallback={ <Loader/> }>
            <Profile/>
        </Suspense>
    )
}