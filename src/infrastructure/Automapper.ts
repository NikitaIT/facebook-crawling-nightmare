import { TPostPage } from "../Area/Person/Posts/Posts";
import { Post } from "../models/Entity/Post";
import { TPhotoPage, TAlbumPage } from "../Area/Person/Photos/Photos";
import { Photo } from "../models/Entity/Photo";
import { Album } from "../models/Entity/Album";

export class Automapper{
    static mapPostPageToPosts = (x: TPostPage): Post => (
        {
            extraData: x.extraData,
            commentsCount: x.commentsCount,
            date: x.date,
            likesCount: x.feedCount.likes,
            place: x.place,
            quotedPostId: x.quotedPost.Id && x.quotedPost.Id.toString(),
            quotedPost: x.quotedPost.value,
            repostsCount: x.repostsCount,
            url: x.url,
            linkImage: x.linkImage
        }
    );
    static mapPhotoPageToPhotos = (x: TPhotoPage): Photo => (
        {
            id: x.id && x.id.toString(),
            albumId:x.albumId
        }
    );
    static mapAlbumPageToAlbums = (x: TAlbumPage): Album => (
        {
            id: x.id && x.id.toString(),
            type:x.type,
            thumbId:x.thumbId && x.thumbId.toString(),
            thumbUrl:x.thumbUrl,
            url:x.url,
            title:x.title,
            description:x.description,
            dateCreated:x.dateCreated,
            dateUpdated:x.dateUpdated,
            photosCount:x.photosCount && x.photosCount.toString(),
            likesCount:x.likesCount && x.likesCount.toString(),
        }
    );
}
