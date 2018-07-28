import { TPostPage } from "../Area/Person/Posts/Posts";
import { Post } from "../models/Entity/Post";
import { TPhotoPage, TAlbumPage } from "../Area/Person/Photos/Photos";
import { Photo } from "../models/Entity/Photo";
import { Album } from "../models/Entity/Album";
import { TLifeEvents } from "../Area/Person/About/LifeEvents";
import { Person } from "../models/Entity/Person";
import { TContactandBasicInfo } from "../Area/Person/About/ContactandBasicInfo";
import { TFriend } from "../Area/Person/Friends/Friends";

export class Automapper{
    /**
     * Ничуть не smart, нужно переделать либо юзать автомапер
     */
    static smartAssign = <T>(...args: T[]): T => {
        return args.reduce((prev:any,current:any) => ({...prev,...current}))
    };

    static mapToPost = {
        FromTPostPage: (x: TPostPage): Post => (
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
        )
    }
    static mapToPhoto = {
        FromTPhotoPage: (x: TPhotoPage): Photo => (
            {
                id: x.id && x.id.toString(),
                albumId:x.albumId
            }
        )
    }
    static mapToAlbum = {
        FromTAlbumPage: (x: TAlbumPage): Album => (
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
        )
    }
    static mapToPerson = {
        FromTLifeEvents: (x: TLifeEvents): Person => (
            {
                birthdate: x.Birthdate,
                relationship: x.Married? "Married" : "No Married"
            }
        ),
        FromTContactandBasicInfo: (x: TContactandBasicInfo): Person => (
            {
                birthdate: x.BirthDate,
                address: `${x.Address.Zip}, ${x.Address.CityOrTown}, ${x.Address.Address}`,
                email: x.Email,
                phone: `${x.MobilePhones}, ${x.Phones.map(x=> `${x.type}:${x.value}`).concat(",")}`,
                gender: x.Gender,
            }
        ),
        FromTFriend: (x: TFriend): Person => (
            {
                id: x.id && x.id.toString(),
                name: x.name,
                photoSmall: x.accauntImage["100x100"],
                url: x.accauntLink
            }
        ),
    };
}