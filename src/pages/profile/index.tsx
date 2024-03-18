import { Suspense } from "react";
import { useParams } from "react-router-dom";
// components
import Loader from "components/shared/Loader";
import Profile from "components/profile/Profile";

export default function ProfilePage() {
  const { id } = useParams();

  return (
    <Suspense fallback={<Loader />}>
      {id && <Profile id={id} />}
    </Suspense>
  );
}