import { useContext, useEffect } from "react";
import { useRecoilState } from "recoil";
import AuthContext from "context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { app } from "firebaseApp";
// components
import { languageSate } from "atom";
import { Flex } from "components/shared/Flex";
import { TextButton } from "components/shared/TextButton";
import { Text } from "components/shared/Text";
import { Spacing } from "components/shared/Spacing";
import { Divider } from "components/shared/Divider";
import { Link } from "react-router-dom";
// hooks
import useTranslation from "hooks/useTranslation";

export default function MorePage() {
  const { user } = useContext(AuthContext);
  const { translation } = useTranslation();
  const [language, setLanguage] = useRecoilState(languageSate);
  const navigate = useNavigate();
  
  // useEffect(() => {
  //   const worker = new Worker(new URL('../worker/testWorker.ts', import.meta.url), { type: 'module' });
  //   worker.onmessage = event => {
  //     console.log(event.data);
  //   }
  //   worker.postMessage('hi im main');

  //   return () => worker.terminate();
  // }, [])
  // 로그아웃 핸들러
  const handleLogout = async () => {
    const confirm = window.confirm('접속을 종료하시겠습니까?');
    if (confirm) {
      const auth = getAuth(app);
      await signOut(auth);

      navigate('/');
      console.log('접속을 종료하셨습니다.');
    }
  };

  // 언어변경 핸들러
  const handleLanguage = () => {
    setLanguage(prev => prev === 'ko' ? 'en' : 'ko');
    // state변경이 비동기적이기 때문에 로컬스토리지에 저장할값을 수동으로 설정해줌
    localStorage.setItem('language', language === 'ko' ? 'en' : 'ko');
  };

  return (
    <Flex direction="column">
      <Text fontSize="xl">{translation("MENU_MORE")}</Text>
      <Spacing size={20} />
      <Divider size={2} />
      <Spacing size={20} />
      <Flex direction="column">
        <Text fontSize="lg">{translation("MY")}</Text>
        <Spacing size={10} />
        {user?.uid ? (
          <TextButton onClick={handleLogout}>
            {translation("MENU_LOGOUT")}
          </TextButton>
        ) : (
          <Link to={'/users/login'}>
            <TextButton>{translation("MENU_LOGIN")}</TextButton>
          </Link>
        )}
        <Spacing size={10} />
        {user?.uid && (
          <Link to={'/notification'}>
            <TextButton>{translation("MENU_NOTI")}</TextButton>
          </Link>
        )}
      </Flex>
      <Spacing size={20} />
      <Divider size={2} />
      <Spacing size={20} />
      <Flex direction="column">
        <Text fontSize="lg">{translation("SETTING")}</Text>
        <Spacing size={10} />
        <ul>
          <li>
            <TextButton onClick={handleLanguage}>
              {`${ language === 'ko' ? '영문으로 바꾸기' : 'Korean Let\'s Go' }`}
            </TextButton>
          </li>
        </ul>
        <Spacing size={10} />
      </Flex>
    </Flex>
  );
}

// import { useContext } from "react";
// import { useRecoilState } from "recoil";
// import AuthContext from "context/AuthContext";
// import { useNavigate } from "react-router-dom";
// import { getAuth, signOut } from "firebase/auth";
// import { app } from "firebaseApp";
// // components
// import { languageSate } from "atom";
// import { Flex } from "components/shared/Flex";
// import { TextButton } from "components/shared/TextButton";
// import { Text } from "components/shared/Text";
// import { Spacing } from "components/shared/Spacing";
// import { Divider } from "components/shared/Divider";
// import { Link } from "react-router-dom";
// // hooks
// import useTranslation from "hooks/useTranslation";


// export default function MorePage() {
//   const { user } = useContext(AuthContext);
//   const { translation } = useTranslation();
//   const [language, setLanguage] = useRecoilState(languageSate);
//   const navigate = useNavigate();
  
//   // 로그아웃 핸들러
//   const handleLogout = async () => {
//     const confirm = window.confirm('접속을 종료하시겠습니까?');
//     if (confirm) {
//       const auth = getAuth(app);
//       await signOut(auth);

//       navigate('/');
//       console.log('접속을 종료하셨습니다.');
//     }
//   };

//   // 언어변경 핸들러
//   const handleLanguage = () => {
//     setLanguage(prev => prev === 'ko' ? 'en' : 'ko');
//     // state변경이 비동기적이기 때문에 로컬스토리지에 저장할값을 수동으로 설정해줌
//     localStorage.setItem('language', language === 'ko' ? 'en' : 'ko');
//   };

//   return (
//     <Flex direction="column">
//       <Text fontSize="xl">{translation("MENU_MORE")}</Text>
//       <Spacing size={20} />
//       <Divider size={2} />
//       <Spacing size={20} />
//       <Flex direction="column">
//         <Text fontSize="lg">{translation("MY")}</Text>
//         <Spacing size={10} />
//         {user?.uid ? (
//           <TextButton onClick={handleLogout}>
//             {translation("MENU_LOGOUT")}
//           </TextButton>
//         ) : (
//           <Link to={'/users/login'}>
//             <TextButton>{translation("MENU_LOGIN")}</TextButton>
//           </Link>
//         )}
//         <Spacing size={10} />
//         {user?.uid && (
//           <Link to={'/notification'}>
//             <TextButton>{translation("MENU_NOTI")}</TextButton>
//           </Link>
//         )}
//       </Flex>
//       <Spacing size={20} />
//       <Divider size={2} />
//       <Spacing size={20} />
//       <Flex direction="column">
//         <Text fontSize="lg">{translation("SETTING")}</Text>
//         <Spacing size={10} />
//         <ul>
//           <li>
//             <TextButton onClick={handleLanguage}>
//               {`${ language === 'ko' ? '영문으로 바꾸기' : 'Korean Let\'s Go' }`}
//             </TextButton>
//           </li>
//         </ul>
//         <Spacing size={10} />
//       </Flex>
//     </Flex>
//   );
// }
