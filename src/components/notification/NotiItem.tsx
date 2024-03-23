import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
// components
import { Spacing } from 'components/shared/Spacing';
import { TextButton } from 'components/shared/TextButton';
import { Text } from 'components/shared/Text';
import { Flex } from 'components/shared/Flex';
// hooks
import useTranslation from 'hooks/useTranslation';
// remotes
import { deleteNotiById, updateNotiById } from 'remotes/notiAPI';
// 데이터 타입
import { NotificationType } from 'interface';


interface NotiItemProps {
  notification: NotificationType;
}

export default function NotiItem({ notification }: NotiItemProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { translation } = useTranslation();

  // 알림클릭 핸들러
  const handleClick = async () => {
    if (!notification.isRead) {
      await updateNotiById(notification.id);
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    }
    if (notification.url) {
      navigate(notification?.url);
    }
  };

  // 알림삭제 핸들러
  const handleClickDelete = async () => {
    if (window.confirm('알림을 삭제하시겠습니까?')) {
      await deleteNotiById(notification.id);
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  };

  return (
    <>
      <TextButton onClick={handleClick} color={notification?.isRead ? "gray" : "white"}>
        {notification?.content}
      </TextButton>
      <Spacing size={10} />
      <Flex justify="space-between">
        <Text color="gray" fontSize="sm">
          {notification?.createdAt}
        </Text>
        <TextButton onClick={handleClickDelete} color="orangered" fontSize='sm'>
          {translation('DELETE')}
        </TextButton>
      </Flex>
      <Spacing size={40} />
    </>
  );
}