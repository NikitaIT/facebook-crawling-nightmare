import { TGotoPageForProfile, MainNav, gotoPageFor } from "../../Nav";
import * as Nightmare from "nightmare";
import { gotoTabOn, EPhotosTabs } from "./PhotosTabs";
import { scrollDown } from "../../../utils/utils";
import { getUserIdByPage } from "../../../utils/Facebook";
export type TPhotoPage = TPhotoPopup & {
    id?:number,
    albumId?:string,
}
type TPhotoPopup = {
    width?:number,
    height?:number,
    photoSmall?:string,
    photoMedium?:string,
    photoLarge?:string
}
type TPhotoPostPage = {
    text:Text,
    location:Text,
    likesCount:number,
    repostCount:number,
    commentsCount:number,
    tagsCount:number,// это то сколько друзей отмечено на фото, тоже в посте
    date:Date,
    dateUpdated:Date,
    place:Text,
    extraData:Text,
}
export type TAlbumPage = { //a[href*="/media/set"]
    id?:number,
    type?:string, 
    thumbId?:number,
    thumbUrl?:string,
    url:string,
    title:string,
    description?:string,
    dateCreated?:Date,
    dateUpdated?:Date,
    photosCount:number,
    likesCount?:number,
    postsCount:number
}

class DataSelector{//TAlbum[]|TPhotoPage[]
    public static run = ( gotoPageForProfile: TGotoPageForProfile ) => (tab: EPhotosTabs) : <T = TAlbumPage|TPhotoPage>() => Promise<T[]> => {
        console.debug("run TPhotoPage")
        const   selectorSection:string = `a[href*="/media/set"]`,
                photosPage = gotoPageForProfile(MainNav.Photos).wait(1000),
                gotoTab = (tab: EPhotosTabs) => scrollDown(gotoTabOn(photosPage)(tab),{selector: selectorSection}),
                getData = (tab: EPhotosTabs) => 
                <T = TAlbumPage|TPhotoPage>(): Promise<T[]>  => new Promise((resolve,reject) =>{
                    gotoTab(tab)
                    .then(() => {
                        getUserIdByPage(photosPage)
                        .then(id => {
                            console.debug("then TPhotoPage start evaluator", tab),
                            photosPage
                                .evaluate(DataSelector.evaluator(tab),id)
                                //.then(DataSelector.mapper)
                                .then((c:T[])=> (console.log(c),resolve(c)))
                                .catch(console.error)
                        });
                    })
                    .catch(console.error)
                });
        return getData(tab);
    };
    //Todo: сделать рефакторинг - стратегия.
    private static evaluator = (tab: EPhotosTabs): (id: number) => (TAlbumPage|TPhotoPage)[] | Promise<(TAlbumPage|TPhotoPage)[]> => {
        switch (tab) {
            case EPhotosTabs.Albums:
                return DataSelector.albumEvaluator;
            case EPhotosTabs.Photos:
            case EPhotosTabs.PhotosOf:
                return DataSelector.photosEvaluator;
            default:
                break;
        }
    }
    // private static photosEvaluator(id: number): Promise<TPhotoPage[]>{
    //     const   photoItems = Array.from(document.querySelectorAll<HTMLLIElement>(`[id*="pagelet_timeline_app_collection"]:not(.hidden_elem) li.fbPhotoStarGridElement`));

    //     const photoItemsPromises: Promise<TPhotoPage>[] = 
    //         photoItems.map((x) : Promise<TPhotoPage> => {
    //             const   textContent = Array.from(x.querySelectorAll<HTMLSpanElement>("span"))
    //                                 .filter( q => q.innerText !== "")
    //                                 .map(q => q.textContent),
    //                     albom = x.querySelector<HTMLLinkElement>(`a[href*="/media/set"]`);

               
    //             return new Promise<TPhotoPopup>((resolve,reject) =>{
    //                 x.click(); // open popup
    //                 const timerId = setInterval( ()=> {
    //                     if(document.querySelector(`.stage img`)){
    //                         clearInterval(timerId);
    //                         const   imgOriginal = x.querySelector<HTMLImageElement>(`.stage img`),
    //                                 imgFilds = {
    //                                     width: imgOriginal.naturalWidth,
    //                                     height: imgOriginal.naturalHeight, // работает, т.к. цель хром
    //                                     photoSmall:"string",
    //                                     photoMedium:"string",
    //                                     photoLarge: imgOriginal && getBase64Image(imgOriginal),
    //                                 };
    //                         document.querySelector<HTMLLinkElement>(`#photos_snowlift a[data-ft*="003C"]`).click(); // close popup
    //                         resolve(imgFilds);
    //                     }
    //                 },500);
    //             }).then<TPhotoPage>(imgFilds => ({
    //                 id: 1,
    //                 albumId: albom && albom.href,
    //                 ...imgFilds
    //             }));
    //         });
    //     return Promise.all(photoItemsPromises);
    // };
    private static photosEvaluator = (id: number): TPhotoPage[] => {
        const   photoItems = Array.from(document.querySelectorAll<HTMLLIElement>(`[id*="pagelet_timeline_app_collection"]:not(.hidden_elem) li.fbPhotoStarGridElement`));

        return photoItems.map((x) : TPhotoPage => {
                const   textContent = Array.from(x.querySelectorAll<HTMLSpanElement>("span"))
                                    .filter( q => q.innerText !== "")
                                    .map(q => q.textContent),
                        albom = x.querySelector<HTMLLinkElement>(`a[href*="/media/set"]`);

               
                return {
                    id: x && x.dataset["fbid"] && parseInt( x.dataset["fbid"], 10),
                    albumId: albom && albom.href
                };
            });
    };
    private static albumEvaluator = (id: number) : TAlbumPage[] => {
        const   albumHrefs = Array.from(document.querySelectorAll<HTMLLinkElement>(`[id*="pagelet_timeline_app_collection"]:not(.hidden_elem) a[href*="/media/set"]`));
        
        return albumHrefs.map((x) : TAlbumPage=> {
                const   textContent = Array.from(x.querySelectorAll<HTMLSpanElement>("span"))
                                    .filter( q => q.innerText !== "")
                                    .map(q => q.textContent),
                        img = x.querySelector<HTMLImageElement>(`img`);
                return {
                thumbUrl: img && img.src,
                url:    x.href,
                title:  textContent && textContent[0],
                photosCount: 
                    textContent 
                    && textContent[1]
                    && textContent[1].match(/(\d+) Items/)
                    && parseInt(textContent[1].match(/(\d+) Items/)[1] || "0",10),
                postsCount: 
                    textContent 
                    && textContent[1]
                    && textContent[1].match(/(\d+) Post/)
                    && parseInt(textContent[1].match(/(\d+) Post/)[1] || "0",10),
            }
        });
    };
    private static mapper = () => {
        return {
        }
    }
}
export const PhotosPages = DataSelector.run