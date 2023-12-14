// components
import PostForm from "components/post/PostForm";
// hooks
import useTranslation from "hooks/useTranslation";

export default function NewPostPage() {
    const { translation } = useTranslation()

    return (
        <div className="">
            <div className="page-header">
                { `${translation('POST')} ${translation('WRITE')}` }
            </div>
            <PostForm/>
        </div>
    )
}