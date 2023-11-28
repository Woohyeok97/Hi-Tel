// components
import PostForm from "components/post/PostForm";

export default function NewPostPage() {

    return (
        <div className="page">
            <div className="page__header">
                <h1>글쓰기</h1>
            </div>
            
            <PostForm/>
        </div>
    )
}