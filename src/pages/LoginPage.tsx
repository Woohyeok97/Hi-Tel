import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GithubAuthProvider, GoogleAuthProvider, User, getAuth, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { app, db } from "firebaseApp";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
// components
import { PageTop } from "components/shared/PageTop";
import { Flex } from "components/shared/Flex";
import { Input } from "components/shared/Input";
import { Spacing } from "components/shared/Spacing";
import { TextButton } from "components/shared/TextButton";
// hooks
import useTranslation from "hooks/useTranslation";



export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { translation } = useTranslation();
  const navigate = useNavigate();

  // submit 핸들러
  const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    // 이메일, 비밀번호 유효성검사
    if (!email || !password) {
      alert('입력을 확인해주십시오.');
      return;
    }
    try {
      const auth = getAuth(app);
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err: any) {
      alert(err?.code);
    }
  };

  // 폼 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e?.target;
    if (name === 'email') {
      setEmail(value?.trim());
    }
    if (name === 'password') {
      setPassword(value?.trim());
    }
  };

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
        second: '2-digit',
      }),
    };
    await setDoc(profileRef, insertData);
  };

  // 소셜 로그인
  const handleSocialLogin = async (platform: 'github' | 'google') => {
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
      navigate('/');
      alert('가입을 환영합니다.');
    } catch(err: any) {
      alert(err?.code);
    }
  };

  return (
    <>
      <PageTop isDivider={true}>
        {translation('MENU_LOGIN')}
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
          <TextButton fontSize="xs" color="gray">
            <Link to="/users/signup">
              도움말) 신규/무료가입을 원하시면 클릭하십시오.
            </Link> 
          </TextButton>
          <Spacing size={30} />
          <Flex direction="row-reverse">
            <Input type="submit" value={translation('MENU_LOGIN')} />
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