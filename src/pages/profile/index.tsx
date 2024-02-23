import { Suspense } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
// components
import Loader from "components/UI/Loader";
import Profile from "components/profile/Profile";
// remotes
import { fetchProfileById } from "remotes/profileAPI";

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();

  const { data: profile } = useQuery({ 
    queryKey: [`profile-${id}`],
    queryFn: () => fetchProfileById(id!),
    enabled: !!id,
    staleTime: 30000,
  });

  return (
      <Suspense fallback={<Loader />}>
        {profile && <Profile profile={profile} />}
      </Suspense>
  )
}