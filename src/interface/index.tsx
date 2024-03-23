import { z } from "zod"
import { CommentSchema, FollowSchema, NotificationSchema, PostSchema, ProfileSchema } from "./zod"

// 게시글 타입
export type PostType = z.infer<typeof PostSchema>;

// 댓글 타입
export type CommentType = z.infer<typeof CommentSchema>;

// 프로필 타입
export type ProfileType = z.infer<typeof ProfileSchema>;

// 팔로잉 & 팔로워 타입
export type FollowType = z.infer<typeof FollowSchema>;

// 알림 타입
export type NotificationType = z.infer<typeof NotificationSchema>;
// 명령어액션 타입
export interface CommandActionsType {
  [key: string]: () => void;
}