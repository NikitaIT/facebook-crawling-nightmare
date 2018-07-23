type Text = string;
export type Post = {
    id?:string,
    extraData?:Text,
    replyOwnerId?:string,
    commentsCount?:number,
    location?:Text,
    date?:Date|string,
    likesCount?:number,
    replyUserId?:string,
    replyToPostId?:string,
    lang?:string,
    place?:Text,
    quotedPostId?:string,
    quotedPost?:string,
    repostsCount?:number,
    platform?:string,
    text?:Text,
    url?:string,
    link?:string,
    linkName?:string,
    linkImage?:string
}