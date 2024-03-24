import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GithubAuthProvider, GoogleAuthProvider, User, createUserWithEmailAndPassword, getAuth, signInWithPopup } from "firebase/auth";
import { app, db } from "firebaseApp";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
// components
import { PageTop } from "components/shared/PageTop";
import { Flex } from "components/shared/Flex";
import { Input } from "components/shared/Input";
import { Spacing } from "components/shared/Spacing";
import { TextButton } from "components/shared/TextButton";
import { Text } from "components/shared/Text";
// hooks
import useTranslation from "hooks/useTranslation";


export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errorMessage, setErrerMessage] = useState('');
  const { translation } = useTranslation();
  const navigate = useNavigate();

  // 기존프로필 확인 함수
  const checkPrevProfile = async (uid: string) => {
    const profileRef = collection(db, 'profiles');
    const profileQuery = query(profileRef, where('uid', '==', uid));
    const result = await getDocs(profileQuery);
    // 기존 profile 콜렉션에 로그인하는 유저 프로필이 있는지 확인 
    return !result?.empty;
  };

  // 프로필 생성 함수
  const createProfile = async (user: User) => {
    const profileRef = doc(db, 'profiles', user?.uid);
    const insertData = {
      displayName: user?.displayName,
      email: user?.email,
      photoURL: user?.photoURL,
      createdAt: new Date().toLocaleDateString("ko", {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
    };
    await setDoc(profileRef, insertData);
  };

  // submit핸들러
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    // 폼 데이터 유효성 검사
    if (!email || !password || !passwordConfirm) {
      alert('입력을 확인해주십시오.');
      return;
    }
    try {
      const auth = getAuth(app);
      // 회원가입(유저생성)
      const result = await createUserWithEmailAndPassword(auth, email, password);
      // 프로필 생성(생성된 유저정보 이용)
      await createProfile(result.user);
      alert('가입을 환영합니다.');
      navigate('/');
    } catch (err: any) {
      alert(err?.code);
    }
  };

  // 소셜 로그인
  const handleSocialLogin = async (platform: string) => {
    try {
      const auth = getAuth(app);
      let provider;

      if (platform === 'github') {
        provider = new GithubAuthProvider();
      }
      if (platform === 'google') {
        provider = new GoogleAuthProvider();
      } 

      const result = await signInWithPopup(auth, provider as GithubAuthProvider | GoogleAuthProvider);
      const prevProfile = await checkPrevProfile(result?.user?.uid);
      if (!prevProfile) {
        await createProfile(result.user);
      }
      alert('가입을 환영합니다.');
      navigate('/');
    } catch(err: any) {
      alert(err?.code);
    }
  };


  // 폼 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e?.target;
    // 이메일 정규식
    const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    let errerMessage = '';

    // 해당 name외에도 유효성검사 실행
    if (name === 'email') { 
      setEmail(value?.trim());
      // 유효성 검사
      if (!value?.match(validRegex)) {
        errerMessage = '이메일 형식으로 입력해주십시오.';
      } else if (password.length < 8) {
        errerMessage = '비밀번호는 8자리 이상이 국룰입니다.';
      } else if (password !== passwordConfirm) {
        errerMessage = '비밀번호를 확인해주십시오.';
      }
    }
    if (name === 'password') {
      setPassword(value?.trim());
      // 유효성 검사
      if (value?.trim().length < 8) {
        errerMessage = '비밀번호는 8자리 이상이 국룰입니다.';
      } else if (value?.trim() !== passwordConfirm) {
        errerMessage = '비밀번호를 확인해주십시오.';
      } else if (!email.match(validRegex)) {
        errerMessage = '이메일 형식으로 입력해주십시오.';
      }
    }
    if (name === 'passwordConfirm') {
      setPasswordConfirm(value?.trim());
      // 유효성 검사
      if (value?.trim() !== password) {
        errerMessage = '비밀번호를 확인해주십시오.';
      } else if (password.length < 8) {
        errerMessage = '비밀번호는 8자리 이상이 국룰입니다.';
      } else if (!email.match(validRegex)) {
        errerMessage = '이메일 형식으로 입력해주십시오.';
      }
    }
    setErrerMessage(errerMessage);
  };

  return (
    <>
      <PageTop isDivider={true}>
        {translation('MENU_SIGNUP')}
      </PageTop>
      <form onSubmit={handleSubmit}>
        <Flex direction="column">
          <Input
            label={translation('EMAIL')}
            type="email"
            name="email"
            onChange={handleChange}
          />
          <Spacing size={20} />
          <Input
            label={translation('PASSWORD')}
            type="password"
            name="password"
            onChange={handleChange}
          />
          <Spacing size={20} />
          <Input
            label={translation('PASSWORD_CONFIRM')}
            type="password"
            name="passwordConfirm"
            onChange={handleChange}
          />
          <Spacing size={20} />
          {errorMessage && (
            <Text color="orangered" fontSize="sm">
              {errorMessage}
              <Spacing size={12} />
            </Text>
          )}
          <TextButton fontSize="xs" color="gray">
            <Link to="/users/login">
              도움말) 기존회원이라면 클릭하십시오.
            </Link> 
          </TextButton>
          <Spacing size={30} />
          <Flex direction="row-reverse">
            <Input type="submit" value={translation('MENU_SIGNUP')} disabled={!!errorMessage} />
          </Flex>
        </Flex>
      </form>
      <Spacing size={40} />
      <Flex gap={20}>
        <TextButton onClick={() => handleSocialLogin('github')} fontSize="md">
          {translation('GITHUB')}?
        </TextButton>
        <TextButton onClick={() => handleSocialLogin('google')} fontSize="md">
          {translation('GOOGLE')}?
        </TextButton>
      </Flex>    
    </>
  );
}