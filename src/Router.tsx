import { Navigate, Route, Routes } from "react-router-dom";
// pages
import HomePage from "pages/home";
import NotificationPage from "pages/notification";
import PostPage from "pages/post";
import EditPostPage from "pages/post/edit";
import NewPostPage from "pages/post/new";
import ProfilePage from "pages/profile";
import EditProfilePage from "pages/profile/edit";
import SearchPage from "pages/search";
import LoginPage from "pages/users/login";
import SignupPage from "pages/users/signup";


export default function Router() {

    return (
        <Routes>
            <Route path="/" element={ <HomePage/> }/>
            <Route path="/post/:id" element={ <PostPage/> }/>
            <Route path="/post/new" element={ <NewPostPage/> }/>
            <Route path="/post/edit/:id" element={ <EditPostPage/> }/>
            <Route path="/porfile/:id" element={ <ProfilePage/> }/>
            <Route path="/profile/edit" element={ <EditProfilePage/> }/>
            <Route path="/search" element={ <SearchPage/> }/>
            <Route path="/notification" element={ <NotificationPage/> }/>

            <Route path="/users/login" element={ <LoginPage/> }/>
            <Route path="/users/signup" element={ <SignupPage/> }/>

            <Route path="*" element={ <Navigate replace to={'/'}/> }/>
        </Routes>
    )
}
