import { Suspense } from "react";
import { useParams } from "react-router-dom";
// components
import Loader from "components/UI/Loader";
import Profile from "components/profile/Profile";

export default function ProfilePage() {
  const { id = '' } = useParams<{ id: string }>();

  return (
    <Suspense fallback={<Loader />}>
      <Profile id={id} />
    </Suspense>
  );
}