import { TGotoPageForProfile, MainNav } from "../Nav";
type TPhotoPage = {
    id:string,
    extraData:Text,
    albumId:string,
    date:Date,
    dateUpdated:Date,
    place:Text,
    width:number,
    height:number,
    text:Text,
    location:Text,
    likesCount:number,
    repostCount:number,
    commentsCount:number,
    tagsCount:number,
    photoSmall:string,
    photoMedium:string,
    photoLarge:string
}
type TAlbum = { //a[href*="/media/set"]
    id:string,
    type:string, 
    thumbId:string,
    thumbUrl:string,
    url:string,
    title:string,
    description:string,
    dateCreated:string,
    dateUpdated:string,
    photosCount:string,
    likesCount:string,
}

class DataSelector{
    public static run = ( gotoPageForProfile: TGotoPageForProfile ) => ()  : Promise<TPhotoPage[]> => {
        const   selectorSection:string = `a[href*="/media/set"]`,
                nm = gotoPageForProfile(MainNav.Photos).wait(1000),
                id = 100025424408094;

        
        return  new Promise((resolve,reject) =>{
            nm.evaluate((selectorSection)=> {
                return new Promise<boolean>((resolve,reject) =>{
                    let count = 0;
                    const timerId = setInterval( ()=> {
                        let prevCount = count;
                        count = document.querySelectorAll(selectorSection).length;
                        if(count == prevCount){
                            clearInterval(timerId);
                            resolve(true);
                        }
                        window.scrollBy(0, 10000);
                    },1000);
                });
            },selectorSection)
            .then((x: Promise<boolean>| boolean) => { //магия, где распаковался промис:?)
                if(x === true){
                    nm
                    .evaluate(DataSelector.evaluator,id)
                    //.then(DataSelector.mapper)
                    .then((c:TPhotoPage[])=> (console.log(c),resolve(c)))
                    .catch(console.error)
                }
            }
            )
        });
    };
    private static evaluator(id: number) : TPhotoPage[]{
        const   albomHrefs = Array.from(document.querySelectorAll<HTMLLinkElement>(`a[href*="/media/set"]`));
        
        return albomHrefs.map((x) : TPhotoPage=> {
                const   textContent = Array.from(x.querySelectorAll<HTMLSpanElement>("span"))
                                    .filter( q => q.innerText !== "")
                                    .map(q => q.textContent),
                        img = x.querySelector<HTMLImageElement>(`img`);
                return {
                thumbUrl: img && img.src,
                url:    x.href,
                title:  textContent[0],
                photosCount:textContent[2] && parseInt(textContent[2]
                    .match(/(\d+) Items/)[1]
                    || "0",10)
            }as any
        });
    };
    private static mapper(){
        return {
        }
    }
}
export const PhotosPages = DataSelector.run