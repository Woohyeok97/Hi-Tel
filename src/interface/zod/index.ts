import { z } from 'zod';

// 코멘트 스키마
export const CommentSchema = z.object({
  uid: z.string(),
  displayName: z.union([
    z.string(),
    z.null()
  ]),
  email: z.string(),
  content: z.string(),
  createdAt: z.string(),
})

// 게시글 스키마
export const PostSchema = z.object({
  id: z.string(),
  uid: z.string(),
  displayName: z.union([
    z.string(),
    z.null()
  ]).optional(),
  email: z.string(),
  content: z.string(),
  createdAt: z.string(),
  hashTag: z.array(z.string()),
  likes: z.array(z.string()).optional(),
  likeCount: z.number().optional(),
  comments: z.array(CommentSchema).optional(),
});

// 프로필 스키마
export const ProfileSchema = z.object({
  uid: z.string(),
  displayName: z.union([
    z.string(),
    z.null()
  ]),
  email: z.string(),
  photoURL: z.union([
    z.string(),
    z.null()
  ]),
  createdAt: z.string(),
});

// 팔로우 스키마
export const FollowSchema = z.object({
  uid: z.string(),
});