// components
import PostEditForm from "components/post/PostEditForm";
// hooks
import useTranslation from "hooks/useTranslation";

export default function EditPostPage() {
    const { translation } = useTranslation()

    return (
        <div className="page">
            <div className="page__title">{ `${translation('POST')} ${translation('EDIT')}` }</div>
            <PostEditForm/>
        </div>
    )
}