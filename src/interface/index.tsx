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
// 프로필 타입
export interface ProfileType {
    uid : string,
    displayName : string | null,
    email : string,
    photoUrl : string,
    createdAt : string,
}
// 팔로잉 & 팔로워 타입
export interface FollowType {
    uid : string,
}
// 알림 타입
export interface NotificationType {
    id : string,
    uid : string,
    content : string,
    url? : string,
    createdAt : string,
    isRead : boolean,
}