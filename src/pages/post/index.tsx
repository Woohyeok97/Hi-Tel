import { useContext } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import AuthContext from "context/AuthContext"
import { Link, useNavigate, useParams } from "react-router-dom"
import { arrayRemove, arrayUnion, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "firebaseApp"
// hooks
import useTranslation from 'hooks/useTranslation'
// components
import CommentForm from "components/comment/CommentForm"
import CommentItem from "components/comment/CommentItem"
// 데이터 타입
import { PostType } from "interface"


export default function PostPage() {
    const { user } = useContext(AuthContext)
    const { id } = useParams()
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const { translation } = useTranslation()


    const fetchPost = async () => {
        if(id) {
            const postRef = doc(db, 'posts', id)
            const result = await getDoc(postRef)
            
            if(!result.exists()) {
                return null
            }
            return { ...result?.data(), id : result?.id } as PostType
        }
    }

    // const { data : post, isError, isLoading } = useQuery([`post-${id}`], fetchPost, {
    //     enabled : !!id,
    //     refetchOnWindowFocus : false,
    //     staleTime : 100000,
    // })
    const { data : post, isError, isLoading } = useQuery({
        queryKey : [`post-${id}`],
        queryFn : fetchPost,
        enabled : !!id,
        refetchOnWindowFocus : false,
        staleTime : 100000,
    })


    const deleteMutation = useMutation({
        mutationFn : async (postId : string) => {
            const confirm = window.confirm('삭제하시겠습니까?')
            if(!confirm) return
            
            const postRef = doc(db, 'posts', postId)
            await deleteDoc(postRef)
            
        },
        onSuccess : () => {
            navigate('/')
            console.log('삭제하셨습니다.')
        },
        onError : (err : any) => {
            console.log(err?.code)
        }
    })

    const likeMutation = useMutation({
        mutationFn : async () => {
            if(!user?.uid) {
                console.log('접속이후 이용해주십시오.')
                return
            }

            if(!post) return

            const postRef = doc(db, 'posts', post?.id)

            if(post?.likes?.includes(user?.uid)) {
                await updateDoc(postRef, {
                    likes : arrayRemove(user?.uid),
                    likeCount : post?.likeCount ? post?.likeCount - 1 : 0
                })
                console.log('추천을 취소하셨습니다.')
                
            } else {
                await updateDoc(postRef, {
                    likes : arrayUnion(user?.uid),
                    likeCount : post?.likeCount ? post?.likeCount + 1 : 1
                })
                console.log('게시글을 추천하셨습니다.')
            }
        },
        onSuccess : () => {
            // queryClient.invalidateQueries(`post-${post?.id}`);
            // queryClient.invalidateQueries(`likePosts`);
        },
        onError : (err : any) => {
            console.log(err?.code)
        }

    })

    if(isLoading) return <div>Loading..</div>

    if(isError) return <div>에러발생</div>
 
    if(!post) return <div>해당 게시글은 없습니다.</div> 



    return (
        <div className="page-container">
            { post?.id && <>
            <div className="flex flex-col pb-5 mb-10 border-gray border-b-2">
                <div className="flex items-center gap-5 mb-5">
                    <div className="user-img"></div>

                    <div className="flex flex-col">
                        <div className="text-btn font-semibold truncate">
                            <Link to={`/profile/${post?.uid}`}>
                                { post?.displayName || post?.email }
                            </Link>
                        </div>
                        <div className="text-gray font-extralight">
                            { post?.createdAt }
                        </div>
                    </div>
                </div>

                <div className="px-5">
                    <div className="pb-5">
                        { post?.content }
                    </div>

                    { post?.hashTag?.length > 0 && 
                    <div className="pb-3">
                        { post?.hashTag?.map((item) => 
                        <span key={item} id={item} className="hash-tag font-bold">
                            #{ item }
                        </span> )}
                    </div> }
                </div>

                <div className="flex justify-between">
                    <div className="flex gap-3">
                        <div 
                            className={`text-btn ${ user?.uid && post?.likes?.includes(user?.uid) && 'post__like--active' }`} 
                            onClick={() => likeMutation.mutate() }>
                            { translation('LIKE') } : { post?.likeCount || 0 }
                        </div>
                        <div>{ translation('COMMENT') } : { post?.comments?.length || 0 }</div>
                    </div>

                    { post?.uid === user?.uid && // 게시글과 로그인정보가 일치할때만 렌더링
                    <div className="flex gap-3">
                        <Link to={`/post/edit/${post?.id}`} className="text-btn underline underline-offset-4">
                            { translation('EDIT') }
                        </Link>
                        <div className="delete-btn" onClick={() => deleteMutation.mutate(post?.id)}> 
                            { translation('DELETE') }
                        </div>
                    </div> }
                </div>
            </div> 
            
            <div className="">
                <div>
                { post?.comments?.map((item) =>
                    <CommentItem key={item?.uid + item?.createdAt} comment={ item } post={ post }/>) }
                </div>
                <CommentForm post={ post }/>
            </div> </> }
        </div>
    )
}