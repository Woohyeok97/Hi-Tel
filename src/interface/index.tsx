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

export interface CommentType {
    uid : string
    displayName : string | null,
    email : string
    content : string
    createdAt : string,
}