// components
import PostEditForm from "components/post/PostEditForm";

export default function EditPostPage() {

    return (
        <div className="page">
            <div className="page__header">
                <h1>글편집</h1>
            </div>

            <PostEditForm/>
        </div>
    )
}