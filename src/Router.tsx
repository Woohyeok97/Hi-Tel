import { Navigate, Route, Routes } from "react-router-dom";
// pages
import HomePage from "pages/HomePage";
import NotificationPage from "pages/notification";
import PostPage from "pages/PostPage";
import PostEditPage from "pages/PostEditPage";
import NewPostPage from "pages/NewPostPage";
import ProfilePage from "pages/ProfilePage";
import ProfileEditPage from "pages/ProfileEditPage";
import SearchPage from "pages/SearchPage";
import LoginPage from "pages/users/login";
import SignupPage from "pages/users/signup";
import MorePage from "pages/MorePage";

interface RouterProps {
  isAuthentication: boolean;
}

export default function Router({ isAuthentication }: RouterProps) {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/post/:id" element={<PostPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/profile/:id" element={<ProfilePage />} />
      <Route path="/more" element={<MorePage />} />
      {isAuthentication ? ( // 로그인 상태일때
        <>
          <Route path="/post/new" element={<NewPostPage />} />
          <Route path="/post/edit/:id" element={<PostEditPage />} />
          <Route path="/profile/edit" element={<ProfileEditPage />} />
          <Route path="/notification" element={<NotificationPage />} />
        </>
      ) : ( // 미로그인 상태일때
        <>
          <Route path="/users/login" element={<LoginPage />} />
          <Route path="/users/signup" element={<SignupPage />} />
        </>
      )}
      {/* 이상한경로 처리 */}
      <Route path="*" element={<Navigate replace to={'/'} />} />
  </Routes>
  );
}
