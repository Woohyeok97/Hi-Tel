import { z } from "zod"
import { CommentSchema, FollowSchema, PostSchema, ProfileSchema } from "./zod"

// 게시글 타입
export type PostType = z.infer<typeof PostSchema>;

// 댓글 타입
export type CommentType = z.infer<typeof CommentSchema>;

// 프로필 타입
export type ProfileType = z.infer<typeof ProfileSchema>;

// 팔로잉 & 팔로워 타입
export type FollowType = z.infer<typeof FollowSchema>;

// 알림 타입
export interface NotificationType {
    id : string,
    uid : string,
    content : string,
    url? : string,
    createdAt : string,
    isRead : boolean,
}
// 명령어액션 타입
export interface CommandActionsType {
    [ key : string ] : () => void 
}