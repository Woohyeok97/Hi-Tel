// 게시글 타입
export interface PostType {
    id : string,
    uid : string,
    displayName? : string | null,
    email : string,
    content : string,
    createdAt : string,
    likes? : string[],
    likeCount? : number,
    comments? : CommentType[],
}
// 댓글 타입
export interface CommentType {
    uid : string
    displayName : string | null,
    email : string
    content : string
    createdAt : string,
}
// 팔로잉 & 팔로워 타입
export interface FollowType {
    uid : string,
}