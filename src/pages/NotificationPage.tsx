import { useContext } from "react";
import AuthContext from "context/AuthContext";
import { useQuery } from "@tanstack/react-query";
// components
import { PageTop } from "components/shared/PageTop";
import { Flex } from "components/shared/Flex";
import Loader from "components/shared/Loader";
import NotiItem from "components/notification/NotiItem";
// hooks
import useTranslation from "hooks/useTranslation";
// remotes
import { fetchNotiListByUid } from "remotes/notiAPI";


export default function NotificationPage() {
  const { user } = useContext(AuthContext);
  const { translation } = useTranslation();
  // 알림 가져오
  const { data: notifications, isLoading } = useQuery({
    queryKey: [`notifications`, user?.uid],
    queryFn: () => fetchNotiListByUid(user?.uid!),
    enabled: !!user?.uid,
    staleTime: 100000,
  });

  return (
    <>
      <PageTop isDivider={true}>
        {translation('MENU_NOTI')}
      </PageTop>
      {isLoading ? (
        <Flex justify="center" align="center">
          <Loader />
        </Flex>
      ) : (
        <Flex direction="column">
          {notifications?.map(item => <NotiItem key={item.id} notification={item} />)}
        </Flex>
      )}
    </>
  );
}